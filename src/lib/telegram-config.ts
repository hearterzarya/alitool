import { getAppSettingValue } from "@/lib/app-settings";

export interface TelegramConfig {
  link: string | null;
}

/**
 * Single source of truth for Telegram contact link.
 * Order: app_settings (DB) > env (TELEGRAM_LINK) > null (no Telegram).
 */
export async function getTelegramConfig(): Promise<TelegramConfig> {
  try {
    const fromDb = await getAppSettingValue("telegram_link");
    const link = fromDb ?? process.env.TELEGRAM_LINK ?? null;
    const trimmed = typeof link === "string" && link.trim() ? link.trim() : null;
    return { link: trimmed };
  } catch (_e) {
    const fallback = typeof process.env.TELEGRAM_LINK === "string" && process.env.TELEGRAM_LINK.trim()
      ? process.env.TELEGRAM_LINK.trim()
      : null;
    return { link: fallback };
  }
}
