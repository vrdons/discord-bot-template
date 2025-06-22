import { Collection } from "discord.js";
import { CooldownOptions, CooldownType } from "../types/cooldown";
import { defaultConfig } from "../config/defaultConfig";

type CooldownInfo = {
  expiresAt: number;
  options: CooldownOptions;
};

export class CooldownManager {
  private static instance: CooldownManager;
  private cooldowns: Collection<string, CooldownInfo> = new Collection();

  private defaultOptions: CooldownOptions = {
    duration: defaultConfig.cooldown?.duration ?? 3000,
    type: defaultConfig.cooldown?.type ?? CooldownType.USER,
    message: defaultConfig.cooldown?.message ?? "You are on cooldown time, please wait {{ &time }}",
  };

  private constructor() {}

  public static getInstance(): CooldownManager {
    if (!CooldownManager.instance) {
      CooldownManager.instance = new CooldownManager();
    }
    return CooldownManager.instance;
  }

  private createKey(commandId: string, targetId: string): string {
    return `${commandId}:${targetId}`;
  }

  private getTargetId(options: CooldownOptions, userId: string, guildId?: string, channelId?: string): string {
    switch (options.type) {
      case CooldownType.USER:
        return userId;
      case CooldownType.GUILD:
        return guildId || "global";
      case CooldownType.CHANNEL:
        return channelId || "global";
      case CooldownType.GLOBAL:
        return "global";
      default:
        return userId;
    }
  }

  private mergeOptions(options?: CooldownOptions): CooldownOptions {
    return {
      ...this.defaultOptions,
      ...(options ?? {}),
    };
  }

  public setCooldown(commandId: string, options: CooldownOptions, userId: string, guildId?: string, channelId?: string): void {
    const cooldownOptions = this.mergeOptions(options);
    const targetId = this.getTargetId(cooldownOptions, userId, guildId, channelId);
    const key = this.createKey(commandId, targetId);
    const expiresAt = Date.now() + cooldownOptions.duration;

    this.cooldowns.set(key, { expiresAt, options: cooldownOptions });

    setTimeout(() => {
      if (this.cooldowns.has(key)) {
        this.cooldowns.delete(key);
      }
    }, cooldownOptions.duration);
  }

  public checkCooldown(
    commandId: string,
    options?: CooldownOptions,
    userId?: string,
    guildId?: string,
    channelId?: string,
  ): { onCooldown: boolean; remainingTime: number; options: CooldownOptions } {
    const cooldownOptions = this.mergeOptions(options);

    if (cooldownOptions.type === CooldownType.USER && !userId) {
      return { onCooldown: false, remainingTime: 0, options: cooldownOptions };
    }

    const targetId = this.getTargetId(cooldownOptions, userId ?? "unknown", guildId, channelId);
    const key = this.createKey(commandId, targetId);
    const cooldown = this.cooldowns.get(key);

    if (!cooldown) {
      return { onCooldown: false, remainingTime: 0, options: cooldownOptions };
    }

    const now = Date.now();
    const remainingTime = cooldown.expiresAt - now;

    if (remainingTime <= 0) {
      this.cooldowns.delete(key);
      return { onCooldown: false, remainingTime: 0, options: cooldown.options };
    }

    return { onCooldown: true, remainingTime, options: cooldown.options };
  }

  public resetCooldown(commandId: string, options: CooldownOptions, userId: string, guildId?: string, channelId?: string): void {
    const cooldownOptions = this.mergeOptions(options);
    const targetId = this.getTargetId(cooldownOptions, userId, guildId, channelId);
    const key = this.createKey(commandId, targetId);
    this.cooldowns.delete(key);
  }
}

export default CooldownManager.getInstance();
