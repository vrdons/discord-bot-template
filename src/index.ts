import dotenv from "dotenv";

import { Bot } from "./classes/Client";
import { globalLog } from "./utils/logger";
import { checkFailed } from "./utils/utils";
import { GatewayIntentBits, Partials } from "discord.js";
globalLog();
dotenv.config();

const allow_sharding = eval(process.env.SHARD!);
if (!allow_sharding) {
  process
    .on("unhandledRejection", (error) => {
      if (checkFailed(error as Error)) process.exit();
      console.log(`Unhandled promise rejection`);

      console.error(error as Error);
    })
    .on("uncaughtException", (error) => {
      if (checkFailed(error as Error)) process.exit();
      console.log(`Uncaught exception`);
      console.error(error as Error);
    });
}
const client = new Bot(
  process.env.BOT_TOKEN!,
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
client.connect();
