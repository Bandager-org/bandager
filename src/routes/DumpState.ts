import {Constants, DatabaseController, Logger, routeMaker} from "../utils";

export const DumpState = routeMaker("dump-state", async (req: any, res: any, logger: Logger) => {
    if (!Constants.IS_DEV  || !Constants.IS_DB_EPHEMERAL) {
        // this should never happen.
        res.status(404).send({
            message: "Not found.",
            error: true
        });
        return;
    }

    const db = new DatabaseController();
    // still 404 because incase the attacker (who somehow bypassed the checks) has a shit http client
    return res.status(404).send(db._dump_state());
});

