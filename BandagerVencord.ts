import {Devs} from "../../bandager-vencord/src/utils/constants";
import definePlugin, {OptionType} from "../../bandager-vencord/src/utils/types";
import {addBadge, BadgePosition, BadgeUserArgs} from "../../bandager-vencord/src/api/Badges";
import {definePluginSettings} from "../../bandager-vencord/src/api/settings";

const settings = definePluginSettings({
    backendURL: {
        type: OptionType.STRING,
        default: "http://localhost:3000"
    }
})

export default definePlugin({
    name: "Bandager",
    description: "Uses the [Bandager API](https://captain8771.github.io/bandager/) to get user banners, avatars, and badges.",
    authors: [Devs.captain],
    settings,
    internalCache: [],
    patches: [
        {
            find: ".hasVerifiedEmailOrPhone=",
            replacement: {
                match: /\i.getAvatarURL=function\(\i,\i\){/,
                replace: "$&let bandager=$self.internalCache.find(x=>x?.id===this.id);if(bandager){if(bandager.avatar){return bandager.avatar}};"
            }
        },
        {
            find: ".getBannerURL=",
            replacement: {
                match: /getBannerURL=function\(\i\){/,
                replace: "$&let bandager=$self.internalCache.find(x=>x?.id===this.userId);if(bandager){if(bandager.banner){return bandager.banner}};"
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
    async start() {
        // fetch a list of all users
        const res = await fetch(`${settings.store.backendURL}/all`)
        const users = await res.json()
        this.internalCache = users.data
        for (const user of users.data) {
            // add the badge
            addBadge({
                description: user.badge.tooltip,
                image: user.badge.url,
                link: "https://captain8771.github.io/bandager/",
                position: BadgePosition.START,
                shouldShow(userInfo: BadgeUserArgs): boolean {
                    return userInfo.user.id === user.id
                }
            })
        }
        // add dev and mod badges
        const res2 = await fetch(`${settings.store.backendURL}/special-badges`)
        const badges = await res2.json()
        addBadge({
            description: badges.data.dev.tooltip,
            image: badges.data.dev.url,
            link: "https://captain8771.github.io/bandager/",
            position: BadgePosition.START,
            shouldShow(userInfo: BadgeUserArgs): boolean {
                const user = users.data.find((x: any) => x.id === userInfo.user.id);
                return user?.dev;
            }
        });
        addBadge({
            description: badges.data.mod.tooltip,
            image: badges.data.mod.url,
            link: "https://captain8771.github.io/bandager/",
            position: BadgePosition.START,
            shouldShow(userInfo: BadgeUserArgs): boolean {
                const user = users.data.find((x: any) => x.id === userInfo.user.id);
                return user?.mod;
            }
        });
    }
});
