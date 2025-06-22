import dotenv from "dotenv";
import { Bot } from "./classes/Client";
import { globalLog } from "./utils/logger";
import { checkFailed } from "./utils/utils";
import { GatewayIntentBits, Partials } from "discord.js";
globalLog();
dotenv.config();

const SHARDING_MANAGER = eval(process.env.SHARDING_MANAGER!);

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
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessagePolls,
  ],
  [Partials.Channel, Partials.Message, Partials.User, Partials.Reaction, Partials.GuildMember]
);
client.reloadEvents();
