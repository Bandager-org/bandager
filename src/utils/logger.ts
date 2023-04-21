const styles = Object.freeze([
    "color: #777777",
    "color: #F0F0F0",
    "color: #777777",
    "color: #F0F0F0",
    "color: #777777"
])

enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}

export class Logger {
    public readonly name: string;
    public readonly level: number;

    constructor(name: string, level: number = -1) {
        this.name = name.toUpperCase();
        this.level = level;
    }

    private _log(level: number, levelstr: string = "UNKNOWN", ...args: any[]) {
        if (level >= this.level) {
            console.log(`%c[%c${this.name}%c|%c${levelstr}%c]`, ...styles, ...args);
        }

        // TODO: Add logging to file
    }

    public debug(...args: any[]) {
        this._log(LogLevel.DEBUG, "DEBUG", ...args);
    }

    public info(...args: any[]) {
        this._log(LogLevel.INFO, "INFO", ...args);
    }

    public warn(...args: any[]) {
        this._log(LogLevel.WARN, "WARN", ...args);
    }

    public error(...args: any[]) {
        this._log(LogLevel.ERROR, "ERROR", ...args);
    }

    public fatal(...args: any[]) {
        this._log(LogLevel.FATAL, "FATAL", ...args);
    }
}
