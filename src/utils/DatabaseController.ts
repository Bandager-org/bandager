import {Pool} from "pg";
import {Constants} from "./Constants";
import { User, UserDBEntry } from "@interfaces/User";
import * as BCrypt from "bcrypt";

export class DatabaseController {
    // this is a singleton class
    private static instance: DatabaseController;
    public pool: Pool;
    private _db: { [key: string]: any[] } = {};

    public constructor() {
        this.pool = new Pool(); // hack to make typescript shut up
        if (DatabaseController.instance) {
            return DatabaseController.instance;
        }
        DatabaseController.instance = this;

        if (Constants.IS_DB_EPHEMERAL) return this._initEphemeral();

        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: "badgeapi",
            password: process.env.DB_PASS,
            port: parseInt(process.env.DB_PORT || "5432"),
        });
    }

    public _dump_state() {
        if (!Constants.IS_DEV || !Constants.IS_DB_EPHEMERAL) return "nope";
        return this._db;
    }

    public convertDbEntryToUser(entry: UserDBEntry): User {
        const user = {
            id: entry.id,
            avatar: {
                static: entry.staticavatar,
                animated: entry.avatar
            },
            banner: entry.banner,
            badge: undefined
        } as User;

        if (entry.badgeurl && entry.badgetooltip) {
            user.badge = {
                url: entry.badgeurl,
                tooltip: entry.badgetooltip
            };
        }


        user.dev = Constants.DEVS.includes(entry.id);
        user.mod = Constants.MODS.includes(entry.id);

        // check for anything missing
        ["id", "avatar", "banner", "badge"].forEach((el: string) => {
            if (Object.keys(user).includes(el)) return;
            Object.defineProperty(user, el, { value: undefined });
        });

        return user;
    }

    public async setToken(userId: string, token: string) {
        // if the table doesn't exist, and the db isn't ephemeral, create it
        if (!Constants.IS_DB_EPHEMERAL) {
            await this.pool.query(`CREATE TABLE IF NOT EXISTS ${Constants.TABLES.AUTH_TOKENS} (id TEXT PRIMARY KEY, token TEXT`);
        }
        // hash the token, with salt.
        const salt = await BCrypt.genSalt(10);
        const hash = await BCrypt.hash(token, salt);
        if (Constants.IS_DB_EPHEMERAL) {
            this._db[Constants.TABLES.AUTH_TOKENS].push({
                id: userId,
                token: hash
            });
            return;
        }

        await this.pool.query(`INSERT INTO ${Constants.TABLES.AUTH_TOKENS} (id, token) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET token = $2;`, [userId, hash]);
    }

    public async generateToken(id: string) {
        const idAsInt: number = parseInt(id);
        const token = [Math.random().toString(36).substring(2, 15), idAsInt.toString(36),  Math.random().toString(36).substring(2, 15)].join(".");
        return token;
    }

    public async isTokenValid(userId: string, token: string) {
        // if the table doesn't exist, and the db isn't ephemeral, create it
        if (!Constants.IS_DB_EPHEMERAL) {
            await this.pool.query(`CREATE TABLE IF NOT EXISTS ${Constants.TABLES.AUTH_TOKENS} (id TEXT PRIMARY KEY, token TEXT`);
        }

        if (Constants.IS_DB_EPHEMERAL) {
            const user = this._db[Constants.TABLES.AUTH_TOKENS].find((user: any) => user.id === userId);
            if (!user) return false;
            const actualToken = user.token;
            return await BCrypt.compare(token, actualToken);
        }

        const user = await this.pool.query(`SELECT * FROM ${Constants.TABLES.AUTH_TOKENS} WHERE id = $1;`, [userId]);
        if (!user.rows[0]) return false;
        const actualToken = user.rows[0].token;
        return await BCrypt.compare(token, actualToken);
    }

    private _initEphemeral(): DatabaseController {
        this._db[Constants.TABLES.USERS] = [];
        this._db[Constants.TABLES.AUTH_TOKENS] = [];

        // add some users
        this._db[Constants.TABLES.USERS].push({
            id: "347366054806159360",
            banner: "https://media.discordapp.net/attachments/927875305262157834/981170298596503642/refuge.png",
            avatar: "https://media.discordapp.net/attachments/927875305262157834/1098265709341048964/pfp.gif",
            badgeurl: "https://cdn.discordapp.com/icons/256926147827335170/a_e22bbced6964eda906bb0700f2557672.gif?size=96",
            badgetooltip: "My burden is light.",
            staticavatar: "https://media.discordapp.net/attachments/1100843516600516608/1100846149386121347/pfp.png"
        });

        return this;
    }

    public async getUsers(): Promise<UserDBEntry[]> {
        if (Constants.IS_DB_EPHEMERAL) return this._db[Constants.TABLES.USERS];
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS ${Constants.TABLES.USERS} (
              id TEXT PRIMARY KEY,
              banner VARCHAR(2048),
              avatar VARCHAR(2048),
              badgeurl VARCHAR(2048),
              badgetooltip VARCHAR(48)
            );`);

        const users = await this.pool.query(`SELECT * FROM ${Constants.TABLES.USERS};`);
        return users.rows;
    }

    // make abstractions for the database, so we don't have to write the same code over and over again
    public async getUser(id: string): Promise<UserDBEntry | undefined> {
        const users = await this.getUsers();
        return users.find((user: any) => user.id === id);
    }

    public async query(query: string, values: any[]): Promise<any> {
        const client = await this.pool.connect();
        try {
            return await client.query(query, values);
        } finally {
            client.release();
        }
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}
