export enum CooldownType {
  USER = "user",
  GUILD = "guild",
  CHANNEL = "channel",
  GLOBAL = "global",
}

export type CooldownOptions = {
  duration: number;
  type: CooldownType;
  message?: string;
};
