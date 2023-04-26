/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import {addBadge, BadgePosition, BadgeUserArgs, ProfileBadge, removeBadge} from "@api/Badges";
import { definePluginSettings } from "@api/settings";
import { Devs } from "@utils/constants";
import { debounce } from "@utils/debounce";
import definePlugin, { OptionType } from "@utils/types";
import { Button, UserStore } from "@webpack/common";

import { authorize } from "./utils";


export interface User {
    // ID of the user, as a number in string form
    id: string;
    // URL to the user's banner
    banner?: string;
    // URL to the user's avatar
    avatar?: {
        animated?: string;
        static: string;
    }
    // Users badge
    badge?: {
        // URL to the badge's image
        url: string;
        // The badge's tooltip
        tooltip: string;
    },
    mod: boolean;
    dev: boolean;
}


const settings = definePluginSettings({
    authorize: {
        type: OptionType.COMPONENT,
        description: "Authorise with Bandager",
        component: () => (
            <Button onClick={() => authorize(settings.store)}>
                Authorise with Bandager
            </Button>
        )
    },
    clearCacheButton: {
        type: OptionType.COMPONENT,
        description: "Clear the local cache.",
        component: () => (
            <Button onClick={() => plugin.clearCache()}>
                Clear cache
            </Button>
        )
    },
    backendURL: {
        type: OptionType.STRING,
        default: "http://localhost:3000",
        description: "The URL to the backend. Don't change unless you know what you're doing."
    }
});

const plugin = definePlugin({
    name: "Bandager",
    description: "Uses the [Bandager API](https://captain8771.github.io/bandager/) to get user banners, avatars, and badges.",
    authors: [Devs.captain],
    settings,
    internalCache: [] as User[],
    determineReturnOfGetAvatar: function (user: any, url: string, canBeAnimated: boolean) {
        // url is the return value of the original function, which is a URL to the user's avatar.
        plugin.bulkFetch(user.id);
        const bandager = plugin.internalCache.find(x => x?.id === user.id);

        if (bandager) {
            if (bandager.avatar) {
                if (canBeAnimated && bandager.avatar.animated) {
                    return bandager.avatar.animated;
                }
                return bandager.avatar.static;
            }
        }
        return url;
    },
    debug(...args: any[]) {
        if (!IS_DEV) return;
        console.log("[Bandager]", ...args);
    },
    patches: [
        {
            find: ".hasVerifiedEmailOrPhone=",
            replacement: {
                match: /(?<=(i.getAvatarURL=function\((\i),(\i)\){.+))return\s+((?:(?!\};).)*)/,
                replace: "return (() => {const x=$4;const ret=$self.determineReturnOfGetAvatar(this, x, n);return ret;})();"
            },
        },
        {
            find: ".getBannerURL=",
            replacement: {
                match: /getBannerURL=function\(\i\){/,
                replace: "$&$self.bulkFetch(this.userId);let bandager=$self.internalCache.find(x=>x?.id===this.userId);if(bandager){if(bandager.banner){return bandager.banner}};"
            }
        },
        {
            find: "getUserProfile=", // see fakeProfileThemes.tsx
            replacement: {
                match: /(?<=getUserProfile=function\(\i\){return )(\i\[\i\])/,
                replace: "$self.makeBannerThingBig($1);"
            }
        }
    ],
    makeBannerThingBig: function (thing: any) {
        if (!thing) return;
        this.ensureDataForUserExists(thing?.userId);
        const bandager = this.internalCache.find((x: any) => x?.id === thing?.userId);
        if (bandager) {
            if (bandager.banner) {
                thing.banner = bandager.banner;
                thing.premiumType = 2;
                thing.themeColors = [3355443, 3355443];
            }
        }
        return thing;
    },
    ensureDataForUserExists(id: string) {
        if (this.internalCache.find((x: any) => x?.id === id)) return;
        const _res = fetch(`${settings.store.backendURL}/user?id=${id}`, {
            headers: {
                ClientMod: "Vencord/Official",
            }
        }).then(res => res.json())
            .then(res => {
                this.internalCache.push(res.data);
                if (res.data.badge?.url) {
                    this.addBadge(id, {
                        description: res.data.badge.tooltip,
                        image: res.data.badge.url,
                        link: "https://captain8771.github.io/bandager/",
                        position: BadgePosition.START,
                        shouldShow(userInfo: BadgeUserArgs): boolean {
                            return userInfo.user.id === res.data.id;
                        }
                    });
                }
                return res.data;
            });

        return _res;

    },
    _ids: [] as string[],
    bulkFetch: (id: string) => {
        if (!plugin._ids.includes(id) && !plugin.internalCache.find((x: any) => x?.id === id)) {
            plugin._ids.push(id);
            plugin.debug(`Debouncing bulk fetch for ${plugin._ids.length} users... (latest: ${id})`);
            plugin._bulkFetch(plugin._ids);
        }
    },
    _bulkFetch: debounce(async (ids: string[]) => {
        plugin.debug(`bulk fetching ${ids.length} users...`);
        const res = await fetch(`${settings.store.backendURL}/bulk-fetch?ids=${ids.join(",")}`, {
            headers: {
                ClientMod: "Vencord/Official",
            }
        });
        const data = await res.json();
        plugin.internalCache.concat(data.data);
        plugin._ids = [];
    }, 1000),
    clearCache: () => {
        plugin.internalCache = [];
        plugin._ids = [];
        plugin.badgeKeys.forEach(x => removeBadge(x));
        plugin.badgeKeys = [];
    },
    badgeKeys: [] as ProfileBadge[],
    async start() {
        const re = await fetch(`${settings.store.backendURL}/oauth-info`, {
            headers: {
                ClientMod: "Vencord/Official",
            }
        }).then(res => res.json());
        settings.store.clientId = re.id;

        // fetch badges for current user prematurely
        const { id } = UserStore.getCurrentUser();
        await this.ensureDataForUserExists(id);

        // add dev and mod badges
        const res = await fetch(`${settings.store.backendURL}/special-badges`, {
            headers: {
                ClientMod: "Vencord/Official",
            }
        });
        const badges = await res.json();
        addBadge({
            description: badges.data.dev.tooltip,
            image: badges.data.dev.url,
            link: "https://captain8771.github.io/bandager/",
            position: BadgePosition.START,
            shouldShow(userInfo: BadgeUserArgs): boolean {
                const user = plugin.internalCache.find(x => x?.id === userInfo.user.id);
                return user?.dev ?? false;
            }
        });
        addBadge({
            description: badges.data.mod.tooltip,
            image: badges.data.mod.url,
            link: "https://captain8771.github.io/bandager/",
            position: BadgePosition.START,
            shouldShow(userInfo: BadgeUserArgs): boolean {
                const user = plugin.internalCache.find(x => x?.id === userInfo.user.id);
                return user?.mod ?? false;
            }
        });
    },
    addBadge(id: string, badge: ProfileBadge) {
        badge.key = id;
        if (this.badgeKeys.find(x => x.key === id)) return;
        addBadge(badge);
        this.badgeKeys.push(badge);
    },
    removeBadge(id: string) {
        removeBadge(this.badgeKeys.find(x => x.key === id));
        this.badgeKeys = this.badgeKeys.filter(x => x !== id);
    }
});

export default plugin;
