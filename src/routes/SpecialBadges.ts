import {Constants, DatabaseController, Logger, routeMaker} from "../utils";

export const SpecialBadges = routeMaker("special-badges", async (req: any, res: any, logger: Logger) => {
    res.send({
        data: {
            dev: {
                url: "https://cdn.discordapp.com/icons/1087733972508868640/5f15da9e818b40e2d0ca008fc3488d89.webp?size=512",
                tooltip: "Bandager Developer"
            },
            mod: {
                url: "https://media.discordapp.net/attachments/1098197341363785791/1098320229580423168/Moderator.png",
                tooltip: "Bandager Moderator"
            }
        },
        error: false,
        message: "Special badges"
    });
});

