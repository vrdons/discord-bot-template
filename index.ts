import dotenv from "dotenv";
import { globalLog } from "./src/utils/logger";
import { ShardingManager } from "discord.js";
import path from "path";
import { checkFailed } from "./src/utils/utils";
dotenv.config();
globalLog();
const filePath = path.resolve(".", "src", "index.ts"); //Botun ana dosyası.
process
  .on("unhandledRejection", (error) => {
    if (checkFailed(error as Error)) process.exit();
    console.error(error as Error);
    console.log("Unhandled promise rejection");
  })
  .on("uncaughtException", (error) => {
    if (checkFailed(error as Error)) process.exit();
    console.error(error as Error);
    console.log("Uncaught exception");
  });
console.log("Starting");

const allow_sharding = eval(process.env.SHARD!);
if (allow_sharding) {
  const manager = new ShardingManager(filePath, {
    totalShards: isNaN(parseInt(process.env.SHARD_COUNT!))
      ? "auto"
      : parseInt(process.env.SHARD_COUNT!),
    respawn: true,
    token: process.env.BOT_TOKEN!,
    silent: false,
    execArgv: ["--import", "tsx"],
  });
  manager.on("shardCreate", (shard) => {
    console.log(`[${shard.id}] Başlatıldı!`);
  });
  manager.spawn();
} else {
  require(`${filePath}`);
}
