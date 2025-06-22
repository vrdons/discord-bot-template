import { Message } from "discord.js";
import { Command } from "../../types/command";
import { Bot } from "../../classes/Client";
import { CooldownType } from "../../types/cooldown";

export default {
  data: {
    name: "ping",
    aliases: ["gecikme", "ms", "latency"],
  },
  detail: {
    allowDM: true,
    detailedDescription: "Botun Discord API'ye olan gecikme süresini milisaniye cinsinden gösterir",
    usage: [`{{prefix}}ping`],
    examples: [`{{prefix}}ping`],
  },
  cooldown: {
    duration: 3000,
    type: CooldownType.USER,
  },
  async execute(message: Message, args: string[], cmd: string, client: Bot) {
    const ping = client.ws.ping;
    return await message.reply({ content: `My ping is ${ping}`, allowedMentions: { repliedUser: false } });
  },
} satisfies Command;
