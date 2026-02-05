import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { grantManualSubscription } from '@/lib/subscription-utils';
import { PlanType } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userRole = (session.user as any).role;
        if (userRole !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { userId, toolId, bundleId, planType, durationDays } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (!toolId && !bundleId) {
            return NextResponse.json(
                { error: 'Tool ID or Bundle ID is required' },
                { status: 400 }
            );
        }

        if (!durationDays || durationDays < 1) {
            return NextResponse.json(
                { error: 'Valid duration in days is required' },
                { status: 400 }
            );
        }

        const adminId = (session.user as any).id;

        // Handle single tool grant
        if (toolId) {
            const result = await grantManualSubscription(
                userId,
                toolId,
                planType as PlanType || 'SHARED',
                durationDays,
                adminId
            );

            return NextResponse.json({
                success: true,
                message: 'Tool access granted successfully',
                subscription: result
            });
        }

        // Handle bundle grant
        if (bundleId) {
            // Fetch tools in bundle
            const bundle = await prisma.bundle.findUnique({
                where: { id: bundleId },
                include: {
                    tools: {
                        include: { tool: true }
                    }
                }
            });

            if (!bundle) {
                return NextResponse.json(
                    { error: 'Bundle not found' },
                    { status: 404 }
                );
            }

            const results = [];
            const bundlePlanType = planType as PlanType || 'SHARED';

            // Grant access to each tool in the bundle
            for (const bundleTool of bundle.tools) {
                try {
                    const result = await grantManualSubscription(
                        userId,
                        bundleTool.toolId,
                        bundlePlanType,
                        durationDays,
                        adminId
                    );
                    results.push({ toolId: bundleTool.toolId, status: 'success', id: result.id });
                } catch (err: any) {
                    console.error(`Failed to grant tool ${bundleTool.toolId} in bundle:`, err);
                    results.push({ toolId: bundleTool.toolId, status: 'error', error: err.message });
                }
            }

            return NextResponse.json({
                success: true,
                message: 'Bundle access granted',
                results
            });
        }

        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );

    } catch (error: any) {
        console.error('Error granting access:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to grant access' },
            { status: 500 }
        );
    }
}
