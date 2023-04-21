import * as Info from "./info";
import * as Dev from "./dev";
import {Message} from "discord.js";

export default {
    ping: Info.PingCommand,
    argtest: Dev.argTestCommand,
    eval: Dev.evalCommand,
} as const as {
    [key: string]: (message: Message, args: string[]) => Promise<void>;
};
