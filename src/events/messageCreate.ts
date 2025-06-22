import { Events } from "discord.js";
import { BotEvent } from "../types/event.js";
import chalk from "chalk";
import { checkAccess } from "../utils/utils.js";

export default {
  name: Events.MessageCreate,
  async execute(client, message) {
    const prefix = process.env.PREFIX!;
    if (message.author.bot || !message.content.toLowerCase().startsWith(prefix)) return;
    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");
    const command =
      client.prefixCommand.get(cmd.toLowerCase()) ||
      Array.from(client.prefixCommand.values()).find((c) => c.data.aliases?.includes(cmd.toLowerCase()));
    if (!command) return;

    console.debug(`${message.author.username} (${message.author.id}) used command '${command.data.name}'`);
    if (command.detail.accessOnly && !checkAccess(message.author.id)) {
      console.debug(`${message.author.username} (${message.author.id}) has no access to use this command '${command.data.name}'`);
      return;
    }
    if (!command.detail.allowDM && message.channel?.isDMBased()) {
      console.debug(`${message.author.username} (${message.author.id}) has no access in DM '${command.data.name}'`);
      return;
    }
    await command.execute(message, args, cmd, client);
  },
} as BotEvent;
