import { prisma } from "@/lib/prisma";

export type AppSettingKey = "meta_pixel_id" | "meta_pixel_enabled";

export async function getAppSettingValue(key: AppSettingKey): Promise<string | null> {
  try {
    const row = await prisma.appSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch (e: any) {
    // If the table doesn't exist yet (fresh DB / not migrated), don't crash the whole app.
    if (e?.code === "P2021" || String(e?.message || "").includes("app_settings")) {
      return null;
    }
    throw e;
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
  } catch (e: any) {
    if (e?.code === "P2021" || String(e?.message || "").includes("app_settings")) {
      return { enabled: false, pixelId: null };
    }
    throw e;
  }
}

