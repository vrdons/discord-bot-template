import { Message } from "discord.js";
import { Command } from "../../types/command";
import { Bot } from "../../classes/Client";

export default {
  data: {
    name: "reload",
    aliases: [],
  },
  detail: {
    accessOnly: true,
  },
  async execute(message: Message, args: string[], cmd: string, client: Bot) {
    await message.reply("Reloading all commands/events");
    if (eval(process.env.SHARDING_MANAGER!)) {
      //@ts-ignore
      await client.shard?.broadcastEval(async (c: Bot) => await c.reloadEvents());
      //@ts-ignore
      client.shard?.broadcastEval((c: Bot) => c.emit("ready"));
    } else {
      await client.reloadEvents();
      //@ts-expect-error
      client.emit("ready", client);
    }
  },
} satisfies Command;
