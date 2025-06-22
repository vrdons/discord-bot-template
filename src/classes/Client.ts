import { BitFieldResolvable, Client, GatewayIntentsString, Options, Partials, REST, Routes } from "discord.js";
import { BotEvent } from "../types/event";
import { loadArray, loadMap } from "../utils/file";
import path from "path";
import ms from "ms";
import { Command, ContextMenu, SlashCommand } from "../types/command";

export class Bot extends Client {
  private events: BotEvent[] = [];
  contextMenu: ContextMenu[] = [];
  slashCommand: Map<string, SlashCommand> = new Map<string, SlashCommand>();
  prefixCommand: Map<string, Command> = new Map<string, Command>();
  public eventsPath = path.join(process.cwd(), "src", "events");
  public prefixCommandPath = path.join(process.cwd(), "src", "commands", "prefix");
  public slashCommandPath = path.join(process.cwd(), "src", "commands", "slash");
  public contextMenuPath = path.join(process.cwd(), "src", "commands", "context");
  constructor(private _token: string, intents: BitFieldResolvable<GatewayIntentsString, number>, partials: readonly Partials[]) {
    super({
      closeTimeout: ms("15s"),
      intents,
      partials,
      allowedMentions: { repliedUser: true },
      sweepers: {
        //Bellek optimizasyonu
        ...Options.DefaultSweeperSettings,
        messages: {
          interval: ms("1h") / ms("1m"), // Her 1 saatte kontrol.
          lifetime: ms("30m") / ms("1m"), // 30 dakikadan önceki mesajları tutma.
        },
        users: {
          interval: ms("1h") / ms("1m"), // Her 1 saatte kontrol.
          filter: () => (user) => user.bot && user.id !== user.client.user.id, //Tüm botları sil.
        },
      },
      makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
      }),
    });
    try {
      const debug = eval(process.env.DEBUG!);
      this.on("debug", (m) => (debug ? console.debug(m) : eval("")));
    } catch (error) {
      console.error(error);
    }
    this.login(this._token);
  }

  public restartAll() {
    process?.send?.({ _sRespawnAll: true });
  }
  public async registerCommands() {
    if (!this.isReady()) return;
    const rest = new REST().setToken(this._token);
    const commandData = [...this.slashCommand.values(), ...this.contextMenu].map((command) => command.data);
    const data = (await rest.put(Routes.applicationCommands(this.user?.id), { body: commandData })) as { length: number };
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  }
  public async reloadCommands() {
    this.prefixCommand = await loadMap<Command>(this.prefixCommandPath, true, "P_COMMAND");
    this.slashCommand = await loadMap<SlashCommand>(this.slashCommandPath, true, "S_COMMAND");
    this.contextMenu = await loadArray<ContextMenu>(this.contextMenuPath, true, "C_COMMAND");
  }
  public async reloadEvents() {
    console.debug("Reloading events...");
    this.removeAllListeners();
    try {
      const debug = eval(process.env.DEBUG!);
      this.on("debug", (m) => (debug ? console.debug(m) : eval("")));
    } catch (error) {
      console.error(error);
    }
    if (process.env.SHARDING_MANAGER) {
      this.on("shardReady", () => process?.send?.({ _ready: true }));
      this.on("shardDisconnect", () => process?.send?.({ _disconnect: true }));
      this.on("shardReconnecting", () => process?.send?.({ _reconnecting: true }));
    }
    this.events = [];

    this.events = await loadArray<BotEvent>(this.eventsPath, true, "EVENTS");
    for (const event of [...this.events]) {
      //TODO: FIX THIS I DONT KNOW
      //@ts-ignore
      this[event.once ? "once" : "on"](event.name, (...args: any[]) => event.execute(this, ...args));
    }
  }
}
