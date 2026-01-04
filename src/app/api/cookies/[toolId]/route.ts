import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptCookies } from "@/lib/encryption";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ toolId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { toolId } = await params;

    // Check if user has active subscription to this tool
    const subscription = await prisma.toolSubscription.findFirst({
      where: {
        userId: (session.user as any).id,
        toolId: toolId,
        status: "ACTIVE",
      },
      include: {
        tool: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found for this tool" },
        { status: 403 }
      );
    }

    // Check if tool has cookies configured
    if (!subscription.tool.cookiesEncrypted) {
      return NextResponse.json(
        { error: "Cookies not configured for this tool" },
        { status: 404 }
      );
    }

    // Decrypt cookies
    const cookies = decryptCookies(subscription.tool.cookiesEncrypted);

    return NextResponse.json({
      cookies,
      url: subscription.tool.toolUrl,
    });
  } catch (error) {
    console.error("Error fetching cookies:", error);
    return NextResponse.json(
      { error: "Failed to fetch cookies" },
      { status: 500 }
    );
  }
}
