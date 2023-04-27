import {Constants, Logger, routeMaker} from "@utils";

export const OAuth2Info = routeMaker("oauth-info", async (req: any, res: any, logger: Logger) => {
    res.send({
        id: Constants.OAUTH_STUFF.CLIENT_ID
    });
});
