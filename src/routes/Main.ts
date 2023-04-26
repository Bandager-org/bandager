import {Constants, Logger, routeMaker} from "../utils";
import {open} from "fs/promises"


export const Main = routeMaker("", async (req: any, res: any, logger: Logger) => {
    if (!Constants.WEB_UI_ENABLED) return res.status(200).send({
        message: "Hello World!",
        error: false
    });

    // read index.html from the frontend dir
    const index = await open("./frontend/index.html", "r");
    const html = await index.readFile("utf-8");
    res.status(200).send(html);
    await index.close();
});
