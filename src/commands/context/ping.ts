import { ApplicationCommandType, ContextMenuCommandInteraction, MessageFlags } from "discord.js";
import { ContextMenu } from "../../types/command";
import { Bot } from "../../classes/Client";

export default {
  data: {
    type: ApplicationCommandType.Message,
    name: "Ping Kontrol",
  },
  detail: {
    usage: ["Bir mesaja sağ tıklayın > Uygulamalar > Ping Kontrol"],
    detailedDescription: "Botun Discord API'ye olan gecikme süresini milisaniye cinsinden gösterir.",
  },
  async execute(interaction: ContextMenuCommandInteraction, client: Bot) {
    if (!interaction.isMessageContextMenuCommand()) return;

    const ping = client.ws.ping;
    await interaction.reply({
      content: `My ping is ${ping}`,
      flags: MessageFlags.Ephemeral,
    });
  },
} satisfies ContextMenu;
