import {
    Logger,
    routeMaker,
    DatabaseController,
    Constants
} from "../utils";
import {UserDBEntry} from "../types/User";


export const User = routeMaker("user", async (req: any, res: any, logger: Logger) => {
    const db = new DatabaseController();
    // make sure the table 'Constants.TABLES.USERS' exists
    // for whatever reason, the $1 syntax doesn't work here
    await db.pool!.query(`
            CREATE TABLE IF NOT EXISTS ${Constants.TABLES.USERS} (
              id TEXT PRIMARY KEY,
              banner VARCHAR(2048),
              avatar VARCHAR(2048),
              badgeurl VARCHAR(2048),
              badgetooltip VARCHAR(48)
            );`);
    const id = req.query.id;

    const users = await db.pool!.query(`SELECT * FROM ${Constants.TABLES.USERS} WHERE id = $1;`, [id]);
    let user: UserDBEntry | undefined;
    try {
        user = users.rows[0];
        if (user === undefined) throw new Error(`User not found.`);
    } catch (e) {
        // return a stub
        res.status(200).send({
            data: {
                id: id,
                banner: null,
                avatar: null,
                badge: {
                    url: null,
                    tooltip: null
                }
            }
        });
        return;
    }
    // return the user
    res.status(200).send({
        data: {
            id: user?.id, // use ?. to make linter happy :)
            banner: user?.banner,
            avatar: user?.avatar,
            badge: {
                url: user?.badgeurl,
                tooltip: user?.badgetooltip
            },
            dev: Constants.DEVS.includes(user?.id!),
            mod: Constants.MODS.includes(user?.id!)
        }
    });

});
