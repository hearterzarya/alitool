import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function requireAdmin(session: any) {
  return !!session && (session.user as any)?.role === "ADMIN";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!requireAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [metaPixelId, metaPixelEnabled] = await Promise.all([
    prisma.appSetting.findUnique({ where: { key: "meta_pixel_id" } }),
    prisma.appSetting.findUnique({ where: { key: "meta_pixel_enabled" } }),
  ]);

  return NextResponse.json({
    metaPixelId: metaPixelId?.value ?? "",
    metaPixelEnabled: (metaPixelEnabled?.value ?? "") === "true",
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!requireAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const metaPixelId = String(data.metaPixelId ?? "").trim();
  const metaPixelEnabled = !!data.metaPixelEnabled;

  await prisma.$transaction([
    prisma.appSetting.upsert({
      where: { key: "meta_pixel_id" },
      create: { key: "meta_pixel_id", value: metaPixelId || null },
      update: { value: metaPixelId || null },
    }),
    prisma.appSetting.upsert({
      where: { key: "meta_pixel_enabled" },
      create: { key: "meta_pixel_enabled", value: metaPixelEnabled ? "true" : "false" },
      update: { value: metaPixelEnabled ? "true" : "false" },
    }),
  ]);

  return NextResponse.json({ success: true });
}

