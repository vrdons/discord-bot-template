import { Bot } from "./classes/Client";
import { globalLog } from "./utils/logger";
import { GatewayIntentBits, Partials } from "discord.js";

globalLog();
const SHARDING_MANAGER = process.env.SHARDING_MANAGER! == "true";
process
  .on("unhandledRejection", (error) => {
    console.log(`Unhandled promise rejection`);
    console.error(error as Error);
    if (SHARDING_MANAGER) process?.send?.({ _disconnect: true });
  })
  .on("uncaughtException", (error) => {
    console.log(`Uncaught exception`);
    console.error(error as Error);
    if (SHARDING_MANAGER) process?.send?.({ _disconnect: true });
  });

const client = new Bot(
  process.env.DISCORD_TOKEN!,
  [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
  [Partials.Channel, Partials.Message, Partials.User, Partials.Reaction, Partials.GuildMember],
);
client.reloadEvents();
