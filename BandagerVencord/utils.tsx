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

import { showNotification } from "@api/Notifications";
import Logger from "@utils/Logger";
import { openModal } from "@utils/modal";
import { findByProps } from "@webpack";


// Stolen from src/plugins/ReviewDB/Utils/utils.tsx
export function authorize(settings: any, callback?: any) {
    const { OAuth2AuthorizeModal } = findByProps("OAuth2AuthorizeModal");

    openModal((props: any) =>
        <OAuth2AuthorizeModal
            {...props}
            scopes={["identify"]}
            responseType="code"
            redirectUri={settings.backendURL + "/auth"}
            permissions={0n}
            clientId={settings.clientId}
            cancelCompletesFlow={false}
            callback={async (u: string) => {
                try {
                    const url = new URL(u);
                    const res = await fetch(url, {
                        headers: { Accept: "application/json", ClientMod: "Vencord/Official" }
                    });
                    const { token, error } = await res.json();
                    if (!error) {
                        settings.token = token;
                        showNotification({
                            title: "Success!",
                            body: "Successfully retrieved Bandager Token."
                        });
                        callback?.();
                    } else if (error) {
                        showNotification({
                            title: "Error!",
                            body: "Failed to retrieve Bandager Token. Did you deny the request?"
                        });
                    }
                } catch (e) {
                    new Logger("Bandager").error("Failed to authorise", e);
                }
            }}
        />
    );
}
