import {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord.js";
import { Bot } from "../classes/Client";

export type CommandData = {
  name: string;
  aliases: string[];
};
export type Detail = {
  allowDM?: boolean;
  accessOnly?: boolean;
  usage?: string[];
  detailedDescription?: string;
  examples?: string[];
};
export type Command = {
  data: CommandData;
  detail: Detail;
  execute(interaction: Message<boolean>, args: string[], cmd: string, client: Bot): Promise<any> | any;
};
export type SlashCommand = {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute(interaction: ChatInputCommandInteraction, client: Bot): Promise<any> | any;
  detail: Detail;
};
export type ContextMenu = {
  data: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  execute(interaction: ContextMenuCommandInteraction, client: Bot): Promise<any> | any;
  detail: Detail;
};
