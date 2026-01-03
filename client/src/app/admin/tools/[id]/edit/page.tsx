import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ToolForm } from "@/components/admin/tool-form";
import { CookieManager } from "@/components/admin/cookie-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const tool = await prisma.tool.findUnique({
    where: { id },
  });

  if (!tool) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Tool</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update tool details and manage cookies
        </p>
      </div>

      <ToolForm mode="edit" tool={tool} />

      <Card>
        <CardHeader>
          <CardTitle>Cookie Management</CardTitle>
          <CardDescription>
            Manage authentication cookies for this tool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CookieManager tool={tool} />
        </CardContent>
      </Card>
    </div>
  );
}
