import { Message } from "discord.js";
import { Command } from "../../types/command";
import { Bot } from "../../classes/Client";

export default {
  data: {
    name: "restart",
    aliases: [],
  },
  detail: {
    accessOnly: true,
  },
  async execute(message: Message, args: string[], cmd: string, client: Bot) {
    if (!eval(process.env.SHARDING_MANAGER!)) return;
    console.warn("RESTARTING ALL SHARDS");
    await message.reply("Restarting all shards");
    client.restartAll();
  },
} satisfies Command;
