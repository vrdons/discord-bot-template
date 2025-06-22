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
    console.error(error as Error);
    console.log("Unhandled promise rejection");
    if (checkFailed(error as Error)) process.exit();
  })
  .on("uncaughtException", (error) => {
    console.error(error as Error);
    console.log("Uncaught exception");
    if (checkFailed(error as Error)) process.exit();
  });
console.log("Starting");
const SHARDING_MANAGER = eval(process.env.SHARDING_MANAGER!);
if (SHARDING_MANAGER) {
  const manager = new ShardingManager(filePath, {
    totalShards: isNaN(parseInt(process.env.SHARD_COUNT!)) ? "auto" : parseInt(process.env.SHARD_COUNT!),
    respawn: true,
    token: process.env.DISCORD_TOKEN!,
    execArgv: ["--import", "tsx"],
  });

  manager.on("shardCreate", (shard) => {
    shard.on("disconnect", () => console.log(`[${shard.id}] Çevrimdışı`));
    shard.on("reconnecting", () => console.log(`[${shard.id}] Yeniden bağlanılıyor`));
    shard.on("message", console.log);
    console.log(`[${shard.id}] Başlatıldı!`);
  });
  manager.spawn();
} else {
  require(`${filePath}`);
}
