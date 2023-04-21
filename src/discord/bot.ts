import * as Discord from 'discord.js';
import {ActivityType} from 'discord.js';
import CommandHandlers from "./handlers";

const client = new Discord.Client({
    // all intents
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        // message intents
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        // message content intents
        Discord.GatewayIntentBits.MessageContent,
    ],
    allowedMentions: {
        parse: ['users'],
        repliedUser: true
    },
    presence: {
        activities: [
            {
                name: "Bandager Support",
                type: ActivityType.Listening
            }
        ],
        status: "online"
    },
    ws: {
        properties: {
            // make it look like android
            browser: "Discord Android",
            device: "Android",
            os: "Android"
        }
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const prefix = "bandage ";
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    // separate command and args, keeping args as a string
    let [command, ..._args] = message.content.slice(prefix.length).split(" ");
    let args: string = _args.join(" ");
    const ArgRegex = /"([^"]*)"|([^\s]+)/g;

    // make args a list of strings
    const actualArgs: string[] = args.match(ArgRegex) ?? [];
    command = command.toLowerCase();

    const handler = CommandHandlers[command];
    if (handler) {
        await handler(message, actualArgs);
    } else {
        await message.reply("Unknown command.");
    }
});

client.on('error', (error) => {
    console.error('Discord client error: ', error);
});


// export function to run the bot in the background
export async function run() {
    await client.login(process.env.DISCORD_TOKEN!);
}
