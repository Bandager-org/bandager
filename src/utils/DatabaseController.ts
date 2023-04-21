import {Pool} from 'pg';
import {Constants} from "./Constants";

export class DatabaseController {
    // this is a singleton class
    private static instance: DatabaseController;
    public pool?: Pool;

    public constructor() {
        if (DatabaseController.instance) {
            return DatabaseController.instance;
        }
        DatabaseController.instance = this;
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: "badgeapi",
            password: process.env.DB_PASS,
            port: parseInt(process.env.DB_PORT!),
        });
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
