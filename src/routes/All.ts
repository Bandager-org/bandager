import {
    Logger,
    routeMaker,
    DatabaseController,
    Constants
} from "../utils";


export const All = routeMaker("all", async (req: any, res: any, logger: Logger) => {
    // TODO: somehow make a notice that if possible, /User should be used instead of /All
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

    // get all the users
    const users = await db.pool!.query(`SELECT * FROM ${Constants.TABLES.USERS};`);
    // make it a list of {id, banner, avatar, badge: {url, tooltip}}
    const userList = users.rows.map((user: any) => {
        return {
            id: user.id,
            banner: user.banner,
            avatar: user.avatar,
            badge: {
                url: user.badgeurl,
                tooltip: user.badgetooltip
            },
            dev: Constants.DEVS.includes(user?.id!),
            mod: Constants.MODS.includes(user?.id!)
        }
    });
    res.status(200).send({
        data: userList,
        error: false,
        message: userList.length
    });
});
