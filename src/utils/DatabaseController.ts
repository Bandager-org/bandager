import {Pool} from 'pg';
import {Constants} from "./Constants";
import { UserDBEntry } from 'types/User';

export class DatabaseController {
    // this is a singleton class
    private static instance: DatabaseController;
    public pool?: Pool;
    // type it as a <string, UserDBEntry[]>
    private _db: { [key: string]: UserDBEntry[] } = {};

    public constructor() {
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
            port: parseInt(process.env.DB_PORT!),
        });
    }

    private _initEphemeral(): DatabaseController {
        this._db[Constants.TABLES.USERS] = [];

        // add some users
        this._db[Constants.TABLES.USERS].push({
            id: "347366054806159360",
            banner: "https://media.discordapp.net/attachments/927875305262157834/981170298596503642/refuge.png",
            avatar: "https://media.discordapp.net/attachments/927875305262157834/1098265709341048964/pfp.gif",
            badgeurl: "https://cdn.discordapp.com/icons/256926147827335170/a_e22bbced6964eda906bb0700f2557672.gif?size=96",
            badgetooltip: "My burden is light."
        });

        return this;
    }

    public async getUsers(): Promise<UserDBEntry[]> {
        if (Constants.IS_DB_EPHEMERAL) return this._db[Constants.TABLES.USERS];
        await this.pool!.query(`
            CREATE TABLE IF NOT EXISTS ${Constants.TABLES.USERS} (
              id TEXT PRIMARY KEY,
              banner VARCHAR(2048),
              avatar VARCHAR(2048),
              badgeurl VARCHAR(2048),
              badgetooltip VARCHAR(48)
            );`);

        const users = await this.pool!.query(`SELECT * FROM ${Constants.TABLES.USERS};`);
        return users.rows;
    }

    // make abstractions for the database, so we don't have to write the same code over and over again
    public async getUser(id: string): Promise<UserDBEntry | undefined> {
        const users = await this.getUsers();
        return users.find((user: any) => user.id === id);
    }

    public async query(query: string, values: any[]): Promise<any> {
        const client = await this.pool!.connect();
        try {
            return await client.query(query, values);
        } finally {
            client.release();
        }
    }

    public async close(): Promise<void> {
        await this.pool!.end();
    }
}
