import { User, UserDBEntry } from "types/User";
import { Constants, DatabaseController, Logger, routeMaker } from "../utils";

export const BulkFetch = routeMaker("bulk-fetch", async (req: any, res: any, logger: Logger) => {
    const db = new DatabaseController();
    const ids: string[] = req.query.ids?.split(",")
    if (!ids) return res.send({ data: [], error: false})

    let users = (await db.getUsers()).filter(el => ids.includes(el.id)).map(db.convertDbEntryToUser);
    // check for any missing users
    if (users.length !== ids.length) {
        // make stubs for the missing users
        let missing: any[] = ids.filter(el => !users.map(x => x.id).includes(el));
        missing = missing.map(el => {
            return db.convertDbEntryToUser({
                id: el,
                banner: undefined,
                avatar: undefined,
                badgeurl: undefined,
                badgetooltip: undefined,
                staticavatar: undefined
            } as UserDBEntry);
        });
        users = users.concat(missing) as User[];
    }

    return res.send({
        data: users,
        error: false
    });
});

