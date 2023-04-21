import { Logger } from "./logger";

export function routeMaker(path: string, func: Function, ...args: any[]) {
    const logger = new Logger("/" + path);
    return (req: any, res: any) => {
        return func(req, res, logger, ...args);
    }
}

