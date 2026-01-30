import { NextResponse } from "next/server";
import { getTelegramConfig } from "@/lib/telegram-config";

/**
 * Public API to get Telegram link for client components.
 * Single source of truth: app_settings (DB) > env (TELEGRAM_LINK).
 */
export async function GET() {
  try {
    const config = await getTelegramConfig();
    return NextResponse.json(config);
  } catch (_e) {
    return NextResponse.json(
      { link: process.env.TELEGRAM_LINK ?? null },
      { status: 200 }
    );
  }
}
