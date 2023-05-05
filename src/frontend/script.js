global = {};
document.addEventListener("DOMContentLoaded", async () => {
    // read theme from local storage
    const theme = localStorage.getItem("theme");
    if (theme) {
        onThemeChange(theme);
    } else {
        // read theme from system
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        onThemeChange(systemTheme);
    }

    document.getElementById("expand-nav").addEventListener("click", () => {
        const that = document.getElementById("expand-nav");
        if (that.classList.contains("active")) {
            that.classList.remove("active");
            document.getElementById("navbar").classList.remove("expanded");
        } else {
            that.classList.add("active");
            document.getElementById("navbar").classList.add("expanded");
        }
    });

    initContact();
    initLinks();
    initPageSpecifics();

    // fetch client ID from server (/oauth-info)
    const res = await fetch("/oauth-info").then(res => res.json());
    global.clientId = res.id;
});

function initPageSpecifics() {
    // check the path
    const path = window.location.pathname;
    switch (path) {
        case "/": {
            const btn = document.getElementsByClassName("login-button")[0];
            btn.addEventListener("click", () => {
                window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${global.clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&scope=identify`;
            });
            break;
        }

        default:
            break;
    }
}

function initContact() {
    const contacts = [
        {
            name: "Discord Server",
            url: "discord"
        },
        {
            name: "GitHub",
            url: "github"
        },
        {
            name: "Youtube",
            // rickroll
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    ];
    const contactList = document.getElementById("contact-list");
    for (const contact of contacts) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        if (contact.url.startsWith("http")) {
            a.href = contact.url;
        } else {
            a.href = `/${contact.url}`;
        }
        a.innerText = contact.name;
        li.appendChild(a);
        contactList.appendChild(li);
    }
}

function initLinks() {
    const links = [
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Projects",
            url: "/projects"
        },
        {
            name: "About",
            url: "/about"
        }
    ];
    const linkList = document.getElementById("link-list");
    for (const link of links) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link.url;
        a.innerText = link.name;
        li.appendChild(a);
        linkList.appendChild(li);
    }
}

let keySequence = [];
const konamiCode = [ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ];

document.addEventListener("keydown", (event) => {
    keySequence.push(event.keyCode);
    if (keySequence.length > konamiCode.length) {
        keySequence.shift();
    }
    if (keySequence.length === konamiCode.length) {
        if (keySequence.every((value, index) => value === konamiCode[index])) {
            document.getElementById("navbar").remove();
        }
    }
});

function toggleTheme() {
    const theme = document.body.classList.contains("theme-light") ? "dark" : "light";
    localStorage.setItem("theme", theme);
    onThemeChange(theme);
}

function onThemeChange(theme) {
    if (![ "light", "dark" ].includes(theme)) {
        throw new TypeError("Invalid theme. Must be either 'light' or 'dark'.");
    }

    const body = document.body;
    // remove old theme
    const oldTheme = theme === "light" ? "dark" : "light";
    body.classList.remove(`theme-${oldTheme}`);
    // add new theme
    body.classList.add(`theme-${theme}`);
}
