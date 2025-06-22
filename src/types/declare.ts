import * as logger from "../utils/logger";
export {};
declare global {
  interface Console {
    sent?: typeof logger.sent;
    alert?: typeof logger.alert;
  }
  namespace NodeJS {
    interface ProcessEnv {
      SHARDING_MANAGER?: string;
      SHARDS?: string;
      SHARD_COUNT?: string | "auto";
      DISCORD_TOKEN?: string;
      DEBUG?: string;
      ACCESS_ID?: string;
      PREFIX?: string;
      [key: string]: string | undefined;
    }
  }
  var SHARD_ID: number | undefined;
}
