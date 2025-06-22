import chalk from "chalk";
import { Bot } from "../classes/Client";
import { TextChannel } from "discord.js";
/**
 * d => 03/05/2023
 
 * D => March 5, 2023

 * t => 2:22 PM

 * T => 2:22:00 PM

 * f => March 5, 2023 2:22 PM

 * F => Sunday, March 5, 2023 2:22 PM

 * R => A minute ago
 */
export type TIMESTAMP_TYPE = "d" | "D" | "t" | "T" | "f" | "F" | "R";
export function checkAccess(id: string) {
  let access = process.env.ACCESS_ID;
  if (!access) access = "";
  const list = access.split(",");
  return list.includes(id);
}
export function formatPrefix(id: string | number) {
  return chalk.redBright(`[${chalk.gray(id)}] `);
}
export function formatTimesamp(timestamp: number, type: TIMESTAMP_TYPE) {
  return `<t:${Math.floor(timestamp / 1000)}${type ? `:${type}` : ""}>`;
}
export function clearCache(client: Bot, channelID: string, messageId: string) {
  const channel = client.channels.cache.get(channelID) as TextChannel;
  if (channel) {
    channel.messages.cache.delete(messageId);
  }
}
