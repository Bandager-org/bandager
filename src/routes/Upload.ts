import {Constants, DatabaseController, Logger, routeMaker} from "@utils";


export const Upload = routeMaker("upload", async (req: any, res: any, logger: Logger) => {
    const db = new DatabaseController();
    await db.pool.query(`
            CREATE TABLE IF NOT EXISTS pending (
              id TEXT PRIMARY KEY,
              banner VARCHAR(2048),
              avatar VARCHAR(2048),
              badgeurl VARCHAR(2048),
              badgetooltip VARCHAR(48)
            );`);

    // get id, banner, avatar, badgeurl, and badgetooltip from the headers
    const id = req.headers.id;
    const banner = req.headers.banner;
    const avatar = req.headers.avatar;
    const badgeurl = req.headers.badge;
    const badgetooltip = req.headers.tooltip;
});
