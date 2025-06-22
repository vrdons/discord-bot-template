import { CooldownOptions, CooldownType } from "../types/cooldown";

export const defaultConfig = {
  cooldown: {
    duration: 3000,
    type: CooldownType.USER,
    message: "Çok hızlısın! {{ &time }} tekrar dene.",
  } as CooldownOptions,
};
