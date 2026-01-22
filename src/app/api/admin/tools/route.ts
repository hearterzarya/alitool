import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });

    return NextResponse.json({ tools });
  } catch (error: any) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Build base create data (always available fields)
    const baseCreateData: any = {
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

    // Try to create with plan fields first, fallback to base fields if schema not updated
    let tool;
    try {
      // Attempt create with plan fields
      const createDataWithPlans = {
        ...baseCreateData,
        sharedPlanPrice: data.sharedPlanPrice !== undefined ? (data.sharedPlanPrice || null) : undefined,
        privatePlanPrice: data.privatePlanPrice !== undefined ? (data.privatePlanPrice || null) : undefined,
        sharedPlanFeatures: data.sharedPlanFeatures !== undefined ? (data.sharedPlanFeatures || null) : undefined,
        privatePlanFeatures: data.privatePlanFeatures !== undefined ? (data.privatePlanFeatures || null) : undefined,
        sharedPlanEnabled: data.sharedPlanEnabled !== undefined ? (data.sharedPlanEnabled ?? false) : undefined,
        privatePlanEnabled: data.privatePlanEnabled !== undefined ? (data.privatePlanEnabled ?? false) : undefined,
      };
      
      // Remove undefined fields
      Object.keys(createDataWithPlans).forEach(key => {
        if (createDataWithPlans[key] === undefined) {
          delete createDataWithPlans[key];
        }
      });

      tool = await prisma.tool.create({
        data: createDataWithPlans,
      });
    } catch (planError: any) {
      // If plan fields don't exist, create without them
      if (planError.message?.includes('Unknown argument') || 
          planError.message?.includes('sharedPlanPrice') ||
          planError.message?.includes('privatePlanPrice')) {
        console.warn('Plan fields not available, creating without them. Run: npx prisma generate && npx prisma db push');
        tool = await prisma.tool.create({
          data: baseCreateData,
        });
      } else {
        throw planError;
      }
    }

    return NextResponse.json(tool, { status: 201 });
  } catch (error: any) {
    console.error("Error creating tool:", error);
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
        error: "Failed to create tool",
        details: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
