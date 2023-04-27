import {Message} from "discord.js";


export async function PingCommand(message: Message): Promise<void> {
    const ping = message.client.ws.ping;
    await message.reply(`Pong! ${ping}ms`);
}
