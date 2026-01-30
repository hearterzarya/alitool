import { getAppSettingValue } from "@/lib/app-settings";

const DEFAULT_NUMBER = "919155313223";
const DEFAULT_MESSAGE = "Hello! I need help with my subscription.";

export interface WhatsAppConfig {
  number: string;
  defaultMessage: string;
}

/**
 * Single source of truth for WhatsApp contact.
 * Order: app_settings (DB) > env > fallback.
 */
export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  try {
    const [fromDbNumber, fromDbMessage] = await Promise.all([
      getAppSettingValue("whatsapp_number"),
      getAppSettingValue("whatsapp_default_message"),
    ]);
    const number = fromDbNumber ?? process.env.WHATSAPP_NUMBER ?? DEFAULT_NUMBER;
    const defaultMessage = fromDbMessage ?? process.env.WHATSAPP_DEFAULT_MESSAGE ?? DEFAULT_MESSAGE;
    return {
      number: String(number ?? DEFAULT_NUMBER).trim(),
      defaultMessage: String(defaultMessage ?? DEFAULT_MESSAGE).trim(),
    };
  } catch (_e) {
    return {
      number: String(process.env.WHATSAPP_NUMBER ?? DEFAULT_NUMBER).trim(),
      defaultMessage: String(process.env.WHATSAPP_DEFAULT_MESSAGE ?? DEFAULT_MESSAGE).trim(),
    };
  }
}

/**
 * Build wa.me URL from number and optional message.
 */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const num = String(number).replace(/\D/g, "") || DEFAULT_NUMBER;
  const base = `https://wa.me/${num}`;
  if (message && message.trim()) {
    return `${base}?text=${encodeURIComponent(message.trim())}`;
  }
  return base;
}
