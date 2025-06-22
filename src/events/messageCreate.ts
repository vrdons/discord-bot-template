import { Events } from "discord.js";
import { BotEvent } from "../types/event.js";
import chalk from "chalk";
import { checkAccess, clearCache, formatTimesamp } from "../utils/utils.js";
import CooldownManager from "../classes/CooldownManager.js";
import mustache from "mustache";

export default {
  name: Events.MessageCreate,
  async execute(client, message) {
    const prefix = process.env.PREFIX!;
    if (message.author.bot || !message.content.toLowerCase().startsWith(prefix)) {
      clearCache(client, message.channelId, message.id);
      return;
    }

    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");
    const command =
      client.prefixCommand.get(cmd.toLowerCase()) ||
      Array.from(client.prefixCommand.values()).find((c) => c.data.aliases?.includes(cmd.toLowerCase()));
    if (!command) {
      clearCache(client, message.channelId, message.id);
      return;
    }

    console.debug(`${message.author.username} (${message.author.id}) used command '${command.data.name}'`);
    if (command.detail.accessOnly && !checkAccess(message.author.id)) {
      console.debug(`${message.author.username} (${message.author.id}) has no access to use this command '${command.data.name}'`);
      clearCache(client, message.channelId, message.id);
      return;
    }
    if (!command.detail.allowDM && message.channel?.isDMBased()) {
      console.debug(`${message.author.username} (${message.author.id}) has no access in DM '${command.data.name}'`);
      clearCache(client, message.channelId, message.id);
      return;
    }
    const cooldownCheck = CooldownManager.checkCooldown(
      command.data.name,
      command.cooldown,
      message.author.id,
      message.guild?.id,
      message.channel?.id,
    );
    if (cooldownCheck.onCooldown) {
      const timeLeft = Date.now() + cooldownCheck.remainingTime;
      const formatTime = formatTimesamp(timeLeft, "R");
      const cooldownMessage = mustache.render(cooldownCheck.options?.message as string, { time: formatTime });

      await message
        .reply({
          content: cooldownMessage,
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch(() => {});
          }, cooldownCheck.remainingTime);
        })
        .catch(() => {});
      clearCache(client, message.channelId, message.id);
      return;
    }
    try {
      await command.execute(message, args, cmd, client);
      if (command.cooldown) {
        CooldownManager.setCooldown(command.data.name, command.cooldown, message.author.id, message.guild?.id, message.channel?.id);
      }
    } catch (error) {
      throw error;
    }
  },
} as BotEvent;
