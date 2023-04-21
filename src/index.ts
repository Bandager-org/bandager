import express from 'express';
import cors from 'cors';
import {Logger} from "./utils";
import * as Routes from "./routes";
import { run } from "./discord";

(async () => {
    const app: express.Application = express();
    const logger = new Logger("main");

    app.use(cors());

    app.use((req: express.Request, res, next) => {
        logger.debug(req.method, req.url);
        next();
    });

    app.get("/", Routes.Main);
    app.get("/all", Routes.All);
    app.get("/user", Routes.User);
    app.post("/upload", Routes.Upload);
    app.get("/special-badges", Routes.SpecialBadges);


    app.use((req, res, next) => {
        res.status(404).send({
            message: "Not found.",
            error: true
        });
        logger.error("404", req.method, req.url);
    });

    app.listen(3000, async () => {
        console.log('Example app listening on port 3000!');
        await run();
    });

})()
