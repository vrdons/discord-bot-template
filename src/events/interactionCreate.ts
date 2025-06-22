import { Events } from "discord.js";
import { BotEvent } from "../types/event.js";
import chalk from "chalk";
import { checkAccess } from "../utils/utils.js";

export default {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommand.get(interaction.commandName);
      console.debug(`${interaction.user.username} (${interaction.user.id}) used command '${interaction.commandName}' (${interaction.commandId})`);
      if (!command) {
        console.error(chalk.redBright(`'${interaction.commandName}' (${interaction.commandId}) was not found.`));
        await interaction.deferReply({ ephemeral: true });
        return;
      }
      if (command.detail.accessOnly && !checkAccess(interaction.user.id)) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access to use this command '${interaction.commandName}' (${interaction.commandId}) `
        );
        return;
      }
      if (!command.detail.allowDM && interaction.channel?.isDMBased()) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access in DM '${interaction.commandName}' (${interaction.commandId}) `
        );
        return await interaction.reply({ ephemeral: true, content: "You have no access that command in DM" });
      }
      await command.execute(interaction, client);
    } else if (interaction.isContextMenuCommand()) {
      const command = client.contextMenu.find((cmd) => cmd.data.name === interaction.commandName && cmd.data.type === interaction.commandType);
      console.debug(`${interaction.user.username} (${interaction.user.id}) used context '${interaction.commandName}' (${interaction.commandId}) `);
      if (!command) {
        console.error(chalk.redBright(`'${interaction.commandName}' (${interaction.commandId}) was not found.`));
        await interaction.deferReply({ ephemeral: true });
        return;
      }
      if (command.detail.accessOnly && !checkAccess(interaction.user.id)) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access to use this command '${interaction.commandName}' (${interaction.commandId}) `
        );
        return;
      }
      if (!command.detail.allowDM && interaction.channel?.isDMBased()) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access in DM '${interaction.commandName}' (${interaction.commandId}) `
        );
        return await interaction.reply({ ephemeral: true, content: "You have no access that command in DM" });
      }
      await command.execute(interaction, client);
    }
  },
} as BotEvent;
