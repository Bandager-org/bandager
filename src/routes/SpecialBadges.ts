import {Constants, DatabaseController, Logger, routeMaker} from "@utils";

export const SpecialBadges = routeMaker("special-badges", async (req: any, res: any, logger: Logger) => {
    res.send({
        data: {
            dev: {
                url: "https://cdn.discordapp.com/attachments/1098205591568130078/1101455427071393822/BandagerDev.png",
                tooltip: "Bandager Developer"
            },
            mod: {
                url: "https://cdn.discordapp.com/attachments/1098205591568130078/1101455426769387571/Moderator.png",
                tooltip: "Bandager Moderator"
            }
        },
        error: false,
        message: "Special badges"
    });
});

