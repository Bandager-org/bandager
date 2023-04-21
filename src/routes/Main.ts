import {Logger, routeMaker} from "../utils";


export const Main = routeMaker("", (req: any, res: any, logger: Logger) => {
    res.status(200).send({
        message: "Hello World!",
        error: false
    });
});
