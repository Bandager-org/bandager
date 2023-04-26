import express from 'express';
import cors from 'cors';
import {Logger} from "./utils";
import * as Routes from "./routes";
import { run } from "./discord";
import { Constants } from './utils';

(async () => {
    const app: express.Application = express();
    const logger = new Logger("main");

    app.use(cors());

    app.use((req: express.Request, res, next) => {
        // check the "ClientMod" header
        const mod = req.headers["clientmod"];
        if (!mod) {
            res.send({
                error: true,
                message: "You must send the 'ClientMod' header containing the client mod, or 'none' (case-insensitive) if you're manually making requests.\nFor example, the official vencord plugin sends 'Vencord/Official' in the header."
            })
            return
        }
        logger.info(`${req.method} ${req.path} from client mod ${mod}`)
        next();
    });

    app.get("/", Routes.Main);
    app.get("/all", Routes.All);
    app.get("/auth", Routes.Auth);
    app.get("/user", Routes.User);
    app.post("/upload", Routes.Upload);
    app.get("/special-badges", Routes.SpecialBadges);
    Constants.IS_DEV && Constants.IS_DB_EPHEMERAL && app.get("/dump-state", Routes.DumpState);
    app.get("/bulk-fetch", Routes.BulkFetch);
    app.get("/oauth-info", Routes.OAuth2Info);


    app.use((req, res, next) => {
        res.status(404).send({
            message: "Not found.",
            error: true
        });
        logger.error("404", req.method, req.url);
    });

    app.listen(Constants.PORT, async () => {
        console.log('Bandager API listening on port ' + Constants.PORT.toString() + '!');
        await run();
    });

})()
