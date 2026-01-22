import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    // Build base update data (always available fields)
    const baseUpdateData: any = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription || null,
      category: data.category,
      icon: data.icon || null,
      toolUrl: data.toolUrl,
      priceMonthly: data.priceMonthly,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      sortOrder: data.sortOrder || 0,
    };

    // Try to update with plan fields first, fallback to base fields if schema not updated
    let tool;
    try {
      // Attempt update with plan fields
      const updateDataWithPlans = {
        ...baseUpdateData,
        sharedPlanPrice: data.sharedPlanPrice !== undefined ? (data.sharedPlanPrice || null) : undefined,
        privatePlanPrice: data.privatePlanPrice !== undefined ? (data.privatePlanPrice || null) : undefined,
        sharedPlanFeatures: data.sharedPlanFeatures !== undefined ? (data.sharedPlanFeatures || null) : undefined,
        privatePlanFeatures: data.privatePlanFeatures !== undefined ? (data.privatePlanFeatures || null) : undefined,
      sharedPlanEnabled: data.sharedPlanEnabled !== undefined ? (data.sharedPlanEnabled ?? false) : undefined,
      privatePlanEnabled: data.privatePlanEnabled !== undefined ? (data.privatePlanEnabled ?? false) : undefined,
      };
      
      // Remove undefined fields
      Object.keys(updateDataWithPlans).forEach(key => {
        if (updateDataWithPlans[key] === undefined) {
          delete updateDataWithPlans[key];
        }
      });

      tool = await prisma.tool.update({
        where: { id },
        data: updateDataWithPlans,
      });
    } catch (planError: any) {
      // If plan fields don't exist, update without them
      if (planError.message?.includes('Unknown argument') || 
          planError.message?.includes('sharedPlanPrice') ||
          planError.message?.includes('privatePlanPrice')) {
        console.warn('Plan fields not available, updating without them. Run: npx prisma generate && npx prisma db push');
        tool = await prisma.tool.update({
          where: { id },
          data: baseUpdateData,
        });
      } else {
        throw planError;
      }
    }

    return NextResponse.json(tool);
  } catch (error: any) {
    console.error("Error updating tool:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A tool with this slug already exists" },
        { status: 400 }
      );
    }
    
    // Check if it's a column missing error
    if (error.message?.includes('Unknown column') || 
        error.message?.includes('column') ||
        error.code === 'P2021') {
      return NextResponse.json(
        { 
          error: "Database schema needs to be updated. Please run: npx prisma generate && npx prisma db push",
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to update tool",
        details: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.tool.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tool:", error);
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    );
  }
}
