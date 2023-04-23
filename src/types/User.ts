export interface User {
    // ID of the user, as a number in string form
    id: string;
    // URL to the user's banner
    banner?: string;
    // URL to the user's avatar
    avatar?: string;
    // Users badge
    badge?: {
        // URL to the badge's image
        url: string;
        // The badge's tooltip
        tooltip: string;
    },
    mod: boolean;
    dev: boolean;
}

export interface UserDBEntry {
    // ID of the user, as a number in string form
    id: string;
    // URL to the user's banner
    banner?: string;
    // URL to the user's avatar
    avatar?: string;
    // URL to the badge's image
    badgeurl?: string;
    // The badge's tooltip
    badgetooltip?: string;
}
