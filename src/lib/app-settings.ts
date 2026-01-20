import { prisma } from "@/lib/prisma";

export type AppSettingKey = "meta_pixel_id" | "meta_pixel_enabled";

export async function getAppSettingValue(key: AppSettingKey): Promise<string | null> {
  const row = await prisma.appSetting.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function getBooleanAppSetting(key: AppSettingKey): Promise<boolean> {
  const v = await getAppSettingValue(key);
  return v === "true" || v === "1" || v === "yes";
}

export async function getMetaPixelConfig(): Promise<{ enabled: boolean; pixelId: string | null }> {
  const [enabled, pixelId] = await Promise.all([
    getBooleanAppSetting("meta_pixel_enabled"),
    getAppSettingValue("meta_pixel_id"),
  ]);

  return { enabled, pixelId };
}

