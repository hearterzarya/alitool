import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function serializeBundle(bundle: { priceMonthly: bigint; priceSixMonth: bigint | null; priceYearly: bigint | null; [k: string]: unknown }) {
  return {
    ...bundle,
    priceMonthly: Number(bundle.priceMonthly),
    priceSixMonth: bundle.priceSixMonth != null ? Number(bundle.priceSixMonth) : null,
    priceYearly: bundle.priceYearly != null ? Number(bundle.priceYearly) : null,
  };
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const data = await req.json();
    const toolIds: string[] = Array.isArray(data.toolIds) ? data.toolIds : [];

    const priceMonthly = typeof data.priceMonthly === "number" ? BigInt(Math.round(data.priceMonthly)) : BigInt(0);
    const priceSixMonth =
      data.priceSixMonth != null && Number(data.priceSixMonth) > 0
        ? BigInt(Math.round(Number(data.priceSixMonth)))
        : null;
    const priceYearly =
      data.priceYearly != null && Number(data.priceYearly) > 0
        ? BigInt(Math.round(Number(data.priceYearly)))
        : null;

    const updated = await prisma.$transaction(async (tx) => {
      const bundle = await tx.bundle.update({
        where: { id },
        data: {
          name: String(data.name ?? "").trim(),
          slug: String(data.slug ?? "").trim(),
          description: String(data.description ?? "").trim(),
          shortDescription: data.shortDescription ? String(data.shortDescription).trim() : null,
          icon: data.icon ? String(data.icon).trim() : null,
          priceMonthly,
          priceSixMonth,
          priceYearly,
          features: data.features ? String(data.features).trim() : null,
          targetAudience: data.targetAudience ? String(data.targetAudience).trim() : null,
          isActive: data.isActive ?? true,
          isTrending: data.isTrending ?? false,
          sortOrder: Number(data.sortOrder) || 0,
        },
      });

      await tx.bundleTool.deleteMany({ where: { bundleId: id } });

      if (toolIds.length > 0) {
        await tx.bundleTool.createMany({
          data: toolIds.map((toolId, idx) => ({
            bundleId: id,
            toolId,
            sortOrder: idx,
          })),
          skipDuplicates: true,
        });
      }

      return bundle;
    });

    return NextResponse.json(serializeBundle(updated));
  } catch (error: any) {
    console.error("Error updating bundle:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A bundle with this slug already exists" }, { status: 400 });
    }
    const message = error?.message || "Unknown error";
    return NextResponse.json(
      { error: "Failed to update bundle", details: message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.bundle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting bundle:", error);
    return NextResponse.json(
      { error: "Failed to delete bundle", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

