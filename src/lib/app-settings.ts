import { prisma } from "@/lib/prisma";

export type AppSettingKey = "meta_pixel_id" | "meta_pixel_enabled" | "whatsapp_number" | "whatsapp_default_message";

// Cache table existence check to avoid repeated queries
let tableExistsCache: boolean | null = null;

async function checkTableExists(): Promise<boolean> {
  if (tableExistsCache !== null) return tableExistsCache;
  try {
    const result = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'app_settings'
      ) as exists`
    );
    tableExistsCache = result[0]?.exists ?? false;
    return tableExistsCache;
  } catch (_e) {
    tableExistsCache = false;
    return false;
  }
}

export async function getAppSettingValue(key: AppSettingKey): Promise<string | null> {
  try {
    const tableExists = await checkTableExists();
    if (!tableExists) return null;
    const row = await prisma.appSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch (_e: any) {
    // Never throw: DB down, table missing, or connection error — return null so app keeps working
    tableExistsCache = false;
    return null;
  }
}

export async function getBooleanAppSetting(key: AppSettingKey): Promise<boolean> {
  const v = await getAppSettingValue(key);
  return v === "true" || v === "1" || v === "yes";
}

export async function getMetaPixelConfig(): Promise<{ enabled: boolean; pixelId: string | null }> {
  try {
    const [enabled, pixelId] = await Promise.all([
      getBooleanAppSetting("meta_pixel_enabled"),
      getAppSettingValue("meta_pixel_id"),
    ]);
    return { enabled, pixelId };
  } catch (_e: any) {
    return { enabled: false, pixelId: null };
  }
}

