import {
    Logger,
    routeMaker,
    DatabaseController,
    Constants
} from "../utils";


export const All = routeMaker("all", async (req: any, res: any, logger: Logger) => {
    // TODO: somehow make a notice that if possible, /User should be used instead of /All
    const db = new DatabaseController();

    // get all the users
    const users = await db.getUsers();
    // make it a list of {id, banner, avatar, badge: {url, tooltip}}
    const userList = users.map((user: any) => {
        return {
            id: user.id,
            banner: user.banner,
            avatar: {
                animated: user.avatar,
                static: user.staticavatar
            },
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
