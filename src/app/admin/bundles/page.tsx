import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Pencil, Plus, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BundlesManagementPage() {
  const bundles = await prisma.bundle.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { tools: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bundles Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage bundle offers</p>
        </div>
        <Button asChild>
          <Link href="/admin/bundles/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Bundle
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bundles.map((b) => (
          <Card key={b.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                      {b.icon && (String(b.icon).startsWith("/") || String(b.icon).startsWith("http")) ? (
                        <Image
                          src={String(b.icon)}
                          alt={b.name}
                          fill
                          className="object-contain object-center p-0.5"
                          sizes="40px"
                          unoptimized={String(b.icon).startsWith("http")}
                        />
                      ) : (
                        <span className="text-xl">{b.icon || "📦"}</span>
                      )}
                    </div>
                    <CardTitle className="text-lg">
                      {b.name}
                    </CardTitle>
                    {b.isActive ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    {b.isTrending && <Badge variant="default">Trending</Badge>}
                  </div>
                  <CardDescription className="mt-1">
                    {b.shortDescription || b.description}
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/bundles/${b.id}/edit`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Price</p>
                  <p className="font-medium">{formatPrice(b.priceMonthly)}/mo</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tools</p>
                  <p className="font-medium">{b._count.tools}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Sort</p>
                  <p className="font-medium">{b.sortOrder}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Slug</p>
                  <p className="font-mono text-xs">{b.slug}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {bundles.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bundles yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first bundle offer</p>
              <Button asChild>
                <Link href="/admin/bundles/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bundle
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

