import {
    Logger,
    routeMaker,
    DatabaseController,
    Constants
} from "../utils";
import {UserDBEntry} from "../types/User";


export const User = routeMaker("user", async (req: any, res: any, logger: Logger) => {
    const db = new DatabaseController();
    const id = req.query.id;

    let user: UserDBEntry | undefined;
    try {
        user = await db.getUser(id);
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
            avatar: {
                animated: user?.avatar,
                static: user?.staticavatar
            },
            badge: {
                url: user?.badgeurl,
                tooltip: user?.badgetooltip
            },
            dev: Constants.DEVS.includes(user?.id!),
            mod: Constants.MODS.includes(user?.id!)
        }
    });

});
