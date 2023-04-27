import { Logger } from "./logger";

// since eslint cries about using 'Function' (@typescript-eslint/ban-types) we need to define the shape
export function routeMaker(path: string, func: (req: any, res: any, logger: Logger) => void) {
    const logger = new Logger("/" + path);
    return (req: any, res: any) => {
        return func(req, res, logger);
    };
}

