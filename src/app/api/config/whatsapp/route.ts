import { NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

/**
 * Public API to get WhatsApp config for client components.
 * Single source of truth: env + app_settings.
 */
export async function GET() {
  try {
    const config = await getWhatsAppConfig();
    return NextResponse.json(config);
  } catch (e) {
    return NextResponse.json(
      { number: process.env.WHATSAPP_NUMBER ?? "919155313223", defaultMessage: "Hello! I need help." },
      { status: 200 }
    );
  }
}
