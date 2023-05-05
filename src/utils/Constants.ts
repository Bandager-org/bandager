import * as process from "process";

const devs: string[] = ["347366054806159360"];
const mods: string[] = [];
export const Constants = {
    // This is the port that the server will listen on
    PORT: 3000,
    // This is the map of table names
    TABLES: Object.freeze({
        USERS: "users",
        AUTH_TOKENS: "authtokens",
    }),
    DEVS: devs as string[],
    MODS: devs.concat(mods) as string[],
    // Environment = "Production" | "Development"
    ENV: process.env.PROD ? "PROD" : "DEV",
    IS_DEV: !process.env.PROD,
    // check if invoked command to run contains "--ephemeral"
    IS_DB_EPHEMERAL: process.argv.includes("--ephemeral"),
    WEB_UI_ENABLED: !process.argv.includes("--no-gui"),
    OAUTH_STUFF: {
        CLIENT_ID: "1100685290311528488",
        CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    },
    BOT_ENABLED: false,
};
