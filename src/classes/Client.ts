import { BitFieldResolvable, Client, GatewayIntentsString, Options, Partials } from "discord.js";
import { BotEvent } from "../types/event";
import { loadArray, loadMap } from "../utils/file";
import path from "path";
import ms from "ms";

export class Bot extends Client {
  private events: BotEvent[] = [];
  private contextMenu: any[] = []; //TODO: Add Context menu
  private slashCommand: Map<string, any> = new Map<string, any>(); //TODO: Add Slash command support
  private prefixCommand: Map<string, any> = new Map<string, any>(); //TODO: Add prefix command support
  public eventsPath = path.join(process.cwd(), "src", "events");
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
    this.on("ready", () => {
      globalThis.SHARD_ID = this.shard?.ids[0];
    });
  }
  connect() {
    console.debug("Connecting..");
    this.login(this._token);
  }
  public restartAll() {
    process?.send?.({ _sRespawnAll: true });
  }
  public reloadCommands() {}
  public async reloadEvents() {
    console.debug("Reloading events...");
    this.removeAllListeners();
    try {
      const debug = eval(process.env.DEBUG!);
      this.on("debug", (m) => (debug ? console.debug(m) : eval("")));
    } catch (error) {
      console.error(error);
    }
    this.on("ready", () => {
      globalThis.SHARD_ID = this.shard?.ids[0];
    });
    this.on("shardReady", () => process?.send?.({ _ready: true }));
    this.on("shardDisconnect", () => process?.send?.({ _disconnect: true }));
    this.on("shardReconnecting", () => process?.send?.({ _reconnecting: true }));
    this.events = [];

    this.events = await loadArray<BotEvent>(this.eventsPath, true, "EVENTS");
    for (const event of [...this.events]) {
      //TODO: FIX THIS I DONT KNOW
      //@ts-ignore
      this[event.once ? "once" : "on"](event.name, (...args: any[]) => event.execute(this, ...args));
    }
  }
}
