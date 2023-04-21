import {Message} from "discord.js";
import {Constants} from "../../utils";

export async function argTestCommand(message: Message, args: string[]): Promise<void> {
    if (!Constants.IS_DEV) {
        await message.reply("This command is only available in development mode.");
        return;
    }
    await message.reply(`\`${args.join("|")}\``);
}

export async function evalCommand(message: Message, args: string[]): Promise<void> {
    if (!Constants.DEVS.includes(message.author.id)) {
        await message.reply("Segmentation fault (core dumped)");
        return;
    }
    let code = args.join(" ");
    // check if it's in a codeblock
    if (code.startsWith("```") && code.endsWith("```")) {
        code = code.slice(6, -3);
    }
    try {
        const client = message.client;
        let result = eval(`(async () =>{\n${code}\n})()`);
        result = await result;
        await message.reply(`\`${result}\``);
    } catch (e) {
        if (!(e instanceof Error)) {
            await message.reply(`\`${e}\``);
            return;
        }
        if ((e.stack?.length ?? 2000) > 1991) {
            await message.reply(e.toString());
        } else {
            await message.reply(`\`\`\`js\n${e.stack}\`\`\``);
        }
    }
}
