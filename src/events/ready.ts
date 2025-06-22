import { Events } from "discord.js";
import chalk from "chalk";
import { BotEvent } from "../types/event.js";
import { Bot } from "../classes/Client.js";

export default {
  name: Events.ClientReady,
  async execute(client) {
    await client.reloadCommands();
    if ((process.env.SHARDING_MANAGER! == "true" && parseInt(`${process.env.SHARDS}`) == 0) || !(process.env.SHARDING_MANAGER! == "true")) {
      client.registerCommands();
    }
    console.log(`${chalk.green(client.user?.tag)} olarak giriş yaptım.`);
    Bun.gc(true);
    //TODO: Im not typescript expert, please help me
    // client.shard?.broadcastEval((c: Bot) => c.reloadEvents())
  },
} as BotEvent;
