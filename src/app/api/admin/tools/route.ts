import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const tool = await prisma.tool.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        category: data.category,
        icon: data.icon || null,
        toolUrl: data.toolUrl,
        priceMonthly: data.priceMonthly,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder || 0,
      },
    });

    return NextResponse.json(tool, { status: 201 });
  } catch (error: any) {
    console.error("Error creating tool:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A tool with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    );
  }
}
