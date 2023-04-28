import {Constants, Logger, routeMaker} from "@utils";
import path from "path";

export const Main = routeMaker("", async (req: any, res: any, logger: Logger) => {
    res.status(200).send({
        message: "Hello World!",
        error: false
    });
});
