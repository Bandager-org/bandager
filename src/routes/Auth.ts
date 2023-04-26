import {Constants, DatabaseController, Logger, routeMaker} from "../utils";

export const Auth = routeMaker("auth", async (req: any, res: any, logger: Logger) => {
    const db = new DatabaseController();
    const code = req.query.code;
    if (!code) {
        return res.status(400).send({
            message: "No code provided.",
            error: true
        });
    }

    // turn the code into an oauth2 token using discord api
    const url = "https://discord.com/api/oauth2/token"
    const body = {
        client_id: Constants.OAUTH_STUFF.CLIENT_ID,
        client_secret: Constants.OAUTH_STUFF.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:3000/auth",
    }
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    const tokenResponse = await fetch(url, {
        method: "POST",
        body: new URLSearchParams(body),
        headers
    }).then(res => res.json());

    const { token_type, access_token } = tokenResponse;
    if (!token_type || !access_token) {
        return res.status(500).send({
            message: "Something went wrong.",
            error: true
        });
    }

    // get the user's info using the token
    const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: {
            "Authorization": `${token_type} ${access_token}`
        }
    }).then(res => res.json());

    // get the id
    const { id } = userResponse;
    if (!id) {
        return res.status(500).send({
            message: "Something went wrong. [2]",
            error: true
        });
    }

    // generate a token
    const token = await db.generateToken(id);
    db.setToken(id, token);
    return res.status(200).send({
        token: token,
        error: false
    });
});

