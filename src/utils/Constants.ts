const devs: string[] = ["347366054806159360"];
const mods: string[] = [];
export const Constants = Object.freeze({
    // This is the port that the server will listen on
    PORT: 3000,
    // This is the map of table names
    TABLES: Object.freeze({
        USERS: "users",
        AUTH_TOKENS: "authtokens",
    }),
    DEVS: devs,
    MODS: devs.concat(mods),
    // Environment = "Production" | "Development"
    ENV: process.env.PROD ? "PROD" : "DEV",
    IS_DEV: !process.env.PROD,
    // check if invoked command to run contains "--ephemeral"
    IS_DB_EPHEMERAL: process.argv.includes("--ephemeral"),
    OAUTH_STUFF: {
        // captain if you push this istg
        CLIENT_ID: "1100685290311528488",
        CLIENT_SECRET: "1i6lHI9pXm9GZV2qP70FGnBnJj_k5e9s"
    }
});
