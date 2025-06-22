import { Events } from "discord.js";
import chalk from "chalk";
import { BotEvent } from "../types/event.js";
import { Bot } from "../classes/Client.js";

export default {
  name: Events.ClientReady,
  async execute(client) {
    await client.reloadCommands();
    if ((eval(process.env.SHARDING_MANAGER!) && parseInt(`${process.env.SHARDS}`) == 0) || !eval(process.env.SHARDING_MANAGER!)) {
      client.registerCommands();
    }
    console.log(`${chalk.green(client.user?.tag)} olarak giriş yaptım.`);
    //TODO: Im not typescript expert, please help me
    // client.shard?.broadcastEval((c: Bot) => c.reloadEvents())
  },
} as BotEvent;
