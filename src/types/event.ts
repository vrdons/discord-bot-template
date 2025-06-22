import { ClientEvents } from "discord.js";
import { Bot } from "../classes/Client";

export type BotEvent = {
  [K in keyof ClientEvents]: {
    name: K;
    once?: boolean;
    execute: (client: Bot, ...args: ClientEvents[K]) => Promise<any> | any;
  };
}[keyof ClientEvents];
