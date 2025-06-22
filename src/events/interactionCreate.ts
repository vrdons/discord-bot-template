import { Events, MessageFlags } from "discord.js";
import { BotEvent } from "../types/event.js";
import chalk from "chalk";
import { checkAccess, clearCache, formatTimesamp } from "../utils/utils.js";
import CooldownManager from "../classes/CooldownManager.js";
import ms from "ms";
import mustache from "mustache";
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
          `${interaction.user.username} (${interaction.user.id}) has no access to use this command '${interaction.commandName}' (${interaction.commandId}) `,
        );
        return;
      }
      if (!command.detail.allowDM && interaction.channel?.isDMBased()) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access in DM '${interaction.commandName}' (${interaction.commandId}) `,
        );

        const cooldownCheck = CooldownManager.checkCooldown(
          command.data.name,
          command.cooldown,
          interaction.user.id,
          interaction.guild?.id,
          interaction.channel?.id,
        );

        if (cooldownCheck.onCooldown) {
          const timeLeft = Date.now() + cooldownCheck.remainingTime;
          const formatTime = formatTimesamp(timeLeft, "R");
          const cooldownMessage = mustache.render(cooldownCheck.options?.message as string, { time: formatTime });

          await interaction.reply({
            content: cooldownMessage,
            flags: MessageFlags.Ephemeral,
          });

          return;
        }

        return await interaction.reply({ flags: MessageFlags.Ephemeral, content: "You have no access that command in DM" });
      }
      try {
        await command.execute(interaction, client);
        if (command.cooldown) {
          CooldownManager.setCooldown(command.data.name, command.cooldown, interaction.user.id, interaction.guild?.id, interaction.channel?.id);
        }
      } catch (err) {
        throw err;
      }
    } else if (interaction.isContextMenuCommand()) {
      const command = client.contextMenu.find((cmd) => cmd.data.name === interaction.commandName && cmd.data.type === interaction.commandType);
      console.debug(`${interaction.user.username} (${interaction.user.id}) used context '${interaction.commandName}' (${interaction.commandId}) `);
      if (!command) {
        console.error(chalk.redBright(`'${interaction.commandName}' (${interaction.commandId}) was not found.`));
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        return;
      }
      if (command.detail.accessOnly && !checkAccess(interaction.user.id)) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access to use this command '${interaction.commandName}' (${interaction.commandId}) `,
        );
        return;
      }
      if (!command.detail.allowDM && interaction.channel?.isDMBased()) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access in DM '${interaction.commandName}' (${interaction.commandId}) `,
        );
        return await interaction.reply({ flags: MessageFlags.Ephemeral, content: "You have no access that command in DM" });
      }
      const cooldownCheck = CooldownManager.checkCooldown(
        command.data.name,
        command.cooldown,
        interaction.user.id,
        interaction.guild?.id,
        interaction.channel?.id,
      );

      if (cooldownCheck.onCooldown) {
        const timeLeft = Date.now() + cooldownCheck.remainingTime;
        const formatTime = formatTimesamp(timeLeft, "R");
        const cooldownMessage = mustache.render(cooldownCheck.options?.message as string, { time: formatTime });

        await interaction.reply({
          content: cooldownMessage,
          flags: MessageFlags.Ephemeral,
        });

        return;
      }
      try {
        await command.execute(interaction, client);
        if (command.cooldown) {
          CooldownManager.setCooldown(command.data.name, command.cooldown, interaction.user.id, interaction.guild?.id, interaction.channel?.id);
        }
      } catch (err) {
        throw err;
      }
    }
  },
} as BotEvent;
