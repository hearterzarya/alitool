import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/subscriptions/pause
 * Body: { subscriptionId: string }
 * Toggles ACTIVE <-> PAUSED for the user's subscription.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const subscriptionId = body?.subscriptionId;

    if (!subscriptionId || typeof subscriptionId !== "string") {
      return NextResponse.json(
        { error: "subscriptionId is required" },
        { status: 400 }
      );
    }

    const subscription = await prisma.toolSubscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (subscription.status !== "ACTIVE" && subscription.status !== "PAUSED") {
      return NextResponse.json(
        { error: "Only active or paused subscriptions can be toggled" },
        { status: 400 }
      );
    }

    const now = new Date();
    const nextStatus = subscription.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    await prisma.toolSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: nextStatus,
        pausedAt: nextStatus === "PAUSED" ? now : null,
      },
    });

    return NextResponse.json({
      success: true,
      status: nextStatus,
      message: nextStatus === "PAUSED" ? "Subscription paused" : "Subscription resumed",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to update subscription" },
      { status: 500 }
    );
  }
}
