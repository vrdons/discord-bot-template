import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { SlashCommand } from "../../types/command";
import { Bot } from "../../classes/Client";

export default {
  data: {
    name: "ping",
    description: "Botun gecikme süresini gösterir",
  },
  detail: { usage: ["/ping"], examples: ["/ping"], detailedDescription: "Botun Discord API'ye olan gecikme süresini milisaniye cinsinden gösterir." },
  async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    const ping = client.ws.ping;
    await interaction.reply({ content: `My ping is ${ping}`, flags: MessageFlags.Ephemeral });
  },
} satisfies SlashCommand;
