import ms from "@sencinion/ms";
import {
  BitFieldResolvable,
  Client,
  GatewayIntentsString,
  Options,
  Partials,
} from "discord.js";

export class Bot extends Client {
  constructor(
    private _token: string,
    intents: BitFieldResolvable<GatewayIntentsString, number>,
    partials: readonly Partials[]
  ) {
    super({
      closeTimeout: ms("15sn"),
      intents,
      partials,
      allowedMentions: { repliedUser: true },
      sweepers: {
        //Bellek optimizasyonu
        ...Options.DefaultSweeperSettings,
        messages: {
          interval: ms("1saat"), // Her 1 saatte kontrol.
          lifetime: ms("30dk"), // 30 dakikadan önceki mesajları tutma.
        },
        users: {
          interval: ms("1saat"), // Her 1 saatte kontrol.
          filter: () => (user) => user.bot && user.id !== user.client.user.id, //Tüm botları sil.
        },
      },
      makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
      }),
    });
    this.login(this._token);
    try {
      const debug = eval(process.env.DEBUG!);
      this.on("debug", (m) => (debug ? console.debug(m) : eval("")));
    } catch (error) {}
    this.on("ready", () => {
      globalThis.SHARD_ID = this.shard?.ids[0];
    });
  }
}
