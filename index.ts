import { globalLog } from "./src/utils/logger";
import { ShardingManager } from "discord.js";
import path from "path";
import { formatPrefix } from "./src/utils/utils";
globalLog();
const filePath = path.resolve(".", "src", "index.ts"); //Botun ana dosyası.
process
  .on("unhandledRejection", (error) => {
    console.log("Unhandled promise rejection");
    console.error(error as Error);
  })
  .on("uncaughtException", (error) => {
    console.log("Uncaught exception");
    console.error(error as Error);
  });
const SHARDING_MANAGER = process.env.SHARDING_MANAGER! == "true";
if (SHARDING_MANAGER) {
  const manager = new ShardingManager(filePath, {
    totalShards: isNaN(parseInt(process.env.SHARD_COUNT!)) ? "auto" : parseInt(process.env.SHARD_COUNT!),
    respawn: true,
    token: process.env.DISCORD_TOKEN!,
    execArgv: ["--bun", "--smol"],
  });

  manager.on("shardCreate", (shard) => {
    shard.on("disconnect", () => console.log(`${formatPrefix(shard.id)}Çevrimdışı`));
    //  shard.on("reconnecting", () => console.log(`[${shard.id}] Yeniden bağlanılıyor`));
    shard.on("message", (msg) => console.log(JSON.stringify(msg)));
    console.log(`${formatPrefix(shard.id)}Başlatıldı!`);
  });
  manager.spawn();
} else {
  require(`${filePath}`);
}
