import chalk from "chalk";
import winston, { LogEntry } from "winston";
import bytes from "bytes";
export const LOG_LEVELS = {
  alert: 0,
  error: 1,
  warn: 2,
  info: 3,
  sent: 4,
  debug: 5,
};
const levelFormats: { [key: string]: string } = {
  alert: chalk.red("[ALERT]"),
  error: chalk.redBright("[ERROR]"),
  warn: chalk.yellowBright("[WARNING]"),
  info: chalk.cyanBright("[INFO]"),
  sent: chalk.greenBright("[SENT]"),
  debug: chalk.blackBright("[DEBUG]"),
};
const consoleFormat = winston.format.printf(({ level, message, timestamp, stack }: (LogEntry & { stack?: string }) | any) => {
  const formattedTimestamp = chalk.bgGray.black(timestamp);
  const levelLabel = levelFormats[level] || chalk.magenta(`[${level.toUpperCase()}]`);
  return stack
    ? `${formattedTimestamp} ${levelLabel} ${message}\n${chalk.redBright(stack)}`
    : `${formattedTimestamp} ${levelLabel} ${level == "debug" ? chalk.blackBright(message) : message}`;
});

const fileFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `[${timestamp}] [${level.toUpperCase()}] ${message}\n  Stack trace:\n    ${stack}`
    : `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

const logger = winston.createLogger({
  level: "sent",
  levels: LOG_LEVELS,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json({ space: 1 })
  ),
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      level: "debug",
      filename: "logs/console.log",
      maxsize: bytes.parse("10gb") as number,
      maxFiles: 5,
      zippedArchive: true,
      format: winston.format.combine(winston.format.uncolorize(), fileFormat),
    }),
  ].filter((wins) => typeof wins !== "undefined"),
  exitOnError: false,
  handleRejections: true,
  handleExceptions: true,
});
const log = (level: string, message: string | Error) => {
  if (message instanceof Error) {
    logger.log(level, message.message, { stack: message.stack });
  } else {
    logger.log(level, message);
  }
};
export const clog = console.log;
const prefix = () => `${globalThis.SHARD_ID !== undefined ? `[${globalThis.SHARD_ID}] ` : ""}`;
export function alert(message: string) {
  log("alert", prefix() + message);
}

export function error(message: string | Error) {
  log("error", typeof message == "string" ? prefix() + message : message);
}

export function warn(message: string) {
  log("warn", prefix() + message);
}

export function info(message: string) {
  log("info", prefix() + message);
}

export function sent(message: string) {
  log("sent", prefix() + message);
}

export function debug(message: string) {
  log("debug", prefix() + message);
}
export function globalLog() {
  globalThis.console.log = info;
  globalThis.console.warn = warn;
  globalThis.console.error = error;
  globalThis.console.alert = alert;
  globalThis.console.sent = sent;
  globalThis.console.debug = debug;
  debug("Logging");
}
