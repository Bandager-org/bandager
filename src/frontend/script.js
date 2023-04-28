document.addEventListener("DOMContentLoaded", () => {
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
});

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