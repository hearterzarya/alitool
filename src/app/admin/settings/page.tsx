import { prisma } from "@/lib/prisma";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [metaPixelId, metaPixelEnabled] = await Promise.all([
    prisma.appSetting.findUnique({ where: { key: "meta_pixel_id" } }),
    prisma.appSetting.findUnique({ where: { key: "meta_pixel_enabled" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Site-wide configuration</p>
      </div>

      <AdminSettingsForm
        initialMetaPixelId={metaPixelId?.value ?? ""}
        initialMetaPixelEnabled={(metaPixelEnabled?.value ?? "") === "true"}
      />
    </div>
  );
}

