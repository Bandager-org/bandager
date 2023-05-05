import express from "express";
import cors from "cors";
import {Logger} from "@utils";
import * as Routes from "@routes";
import { run } from "@discord";
import { Constants } from "@utils";
import path from "path";
import * as fs from "fs";

(async () => {
    const app: express.Application = express();
    const logger = new Logger("main");

    app.use(cors());

    app.use((req: express.Request, res, next) => {
        // check the "ClientMod" header
        const mod = req.headers["clientmod"];
        if (!mod) {
            // check if its a browser
            if (!(req.headers["user-agent"]?.toLowerCase()?.includes("mozilla") && !req.headers["user-agent"]?.toLowerCase().includes("discord"))) {
                res.send({
                    error: true,
                    message: "You must send the 'ClientMod' header containing the client mod, or 'none' (case-insensitive) if you're manually making requests.\nFor example, the official vencord plugin sends 'Vencord/Official' in the header."
                });
                return;
            }
            logger.info(`${req.method} ${req.path} from browser`);
            next();
            return;
        }
        logger.info(`${req.method} ${req.path} from client mod ${mod}`);
        next();
    });

    // app.get("/", Routes.Main);
    app.get("/all", Routes.All);
    app.get("/auth", Routes.Auth);
    app.get("/user", Routes.User);
    app.post("/upload", Routes.Upload);
    app.get("/special-badges", Routes.SpecialBadges);
    Constants.IS_DEV && Constants.IS_DB_EPHEMERAL && app.get("/dump-state", Routes.DumpState);
    app.get("/bulk-fetch", Routes.BulkFetch);
    app.get("/oauth-info", Routes.OAuth2Info);

    function modifiedStatic(req: any, res: any, next: any) {
        // mimic the behavior of express.static
        // but disallow base.html

        // read the file
        let file = path.join(__dirname, "frontend", req.path);
        if (file.endsWith("/")) {
            file = file + "index.html";
        }

        const allowedExtensions: string[] = [
            "html",
            "css",
            "js",
            "png",
            "jpg",
            "jpeg",
            "gif",
            "svg",
            "ico"
        ];

        if (!allowedExtensions.includes(file.split(".").pop())) {
            // check if .html exists
            const htmlFile = file + ".html";
            if (fs.existsSync(htmlFile)) {
                file = htmlFile;
            } else {
                return next();
            }
        }

        if (!fs.existsSync(file)) {
            return next();
        }

        if (file.endsWith("base.html")) {
            return next();
        }

        const isHtml = file.endsWith(".html");

        if (isHtml) {
            // read the file
            const buf = fs.openSync(file, "r");
            const data = fs.readFileSync(buf);
            fs.closeSync(buf);

            // read base.html
            const base = path.join(__dirname, "frontend", "base.html");
            const baseBuf = fs.openSync(base, "r");
            const baseData = fs.readFileSync(baseBuf);
            fs.closeSync(baseBuf);

            let content = data.toString();
            let head = "";

            // does content contain "<!-- CONTENT -->"?
            if (content.includes("<!-- CONTENT -->")) {
                // skip forward to <!-- CONTENT -->
                const start = content.indexOf("<!-- CONTENT -->") + "<!-- CONTENT -->".length;
                content = content.substring(start);
                // make head the stuff before <!-- CONTENT -->
                head = data.toString().substring(0, start - "<!-- CONTENT -->".length);
            }
            const final = baseData.toString().replace("{{CONTENT}}", content).replace("{{HEAD}}", head);
            res.send(final);
        } else {
            res.sendFile(file);
        }
    }

    if (Constants.WEB_UI_ENABLED) app.use("/", modifiedStatic);


    app.use((req, res, next) => {
        res.status(404).send({
            message: "Not found: " + req.path,
            error: true
        });
        logger.error("404", req.method, req.url);
    });

    app.listen(Constants.PORT, async () => {
        console.log("Bandager API listening on port " + Constants.PORT.toString() + "!");
        await run();
    });

})();
