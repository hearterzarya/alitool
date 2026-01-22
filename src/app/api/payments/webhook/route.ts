import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSubscriptionAfterPayment } from '@/lib/subscription-utils';
import { PlanType } from '@prisma/client';

/**
 * Paygic Webhook Handler
 * This endpoint receives payment status updates from Paygic
 * Documentation: https://docs.paygic.in/status-and-callback
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Paygic webhook payload structure
    const {
      merchantReferenceId,
      paygicReferenceId,
      txnStatus,
      amount,
      successDate,
    } = body;

    if (!merchantReferenceId) {
      return NextResponse.json(
        { error: 'Missing merchantReferenceId' },
        { status: 400 }
      );
    }

    // Find payment in database
    const payment = await prisma.payment.findUnique({
      where: { merchantReferenceId },
      include: { 
        user: true, 
        tool: true,
        bundle: true, // Include bundle if payment is for a bundle
      },
    });

    if (!payment) {
      console.error(`Payment not found for merchantReferenceId: ${merchantReferenceId}`);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: txnStatus === 'SUCCESS' ? 'SUCCESS' : 
                txnStatus === 'FAILED' ? 'FAILED' : 
                txnStatus === 'EXPIRED' ? 'EXPIRED' : 'PENDING',
        txnStatus,
        paygicReferenceId: paygicReferenceId || payment.paygicReferenceId,
        successDate: successDate ? new Date(successDate) : payment.successDate,
      },
    });

    // If payment is successful, create or update subscription
    if (txnStatus === 'SUCCESS' && updatedPayment.status === 'SUCCESS') {
      if (updatedPayment.toolId) {
        // Single tool purchase
        const planType = ((updatedPayment as any).planType || PlanType.SHARED) as PlanType;
        
        try {
          await createSubscriptionAfterPayment(
            payment.userId,
            updatedPayment.toolId,
            planType,
            updatedPayment.id
          );
        } catch (error: any) {
          console.error('Error creating subscription after payment:', error);
          // Don't fail webhook, log error for manual review
        }
      } else if (updatedPayment.bundleId) {
        // Bundle purchase - create subscriptions for all tools in bundle
        try {
          // Check if bundle model exists
          if (!('bundle' in prisma) || typeof (prisma as any).bundle?.findUnique !== 'function') {
            console.error('Bundle model not available. Please run: npx prisma generate');
            return NextResponse.json({
              success: true,
              message: 'Webhook processed, but bundle subscriptions require database migration',
            });
          }

          const bundle = await (prisma as any).bundle.findUnique({
            where: { id: updatedPayment.bundleId },
            include: {
              tools: {
                include: {
                  tool: true,
                },
                orderBy: {
                  sortOrder: 'asc',
                },
              },
            },
          });

          if (!bundle) {
            console.error(`Bundle not found: ${updatedPayment.bundleId}`);
            return NextResponse.json({
              success: true,
              message: 'Webhook processed, but bundle not found',
            });
          }

          // Determine subscription period based on planName
          const planName = String((updatedPayment as any).planName || '').toLowerCase();
          let subscriptionDays = 30; // Default monthly
          
          if (planName.includes('six') || planName.includes('6') || planName.includes('sixmonth')) {
            subscriptionDays = 180; // 6 months
          } else if (planName.includes('year') || planName.includes('yearly')) {
            subscriptionDays = 365; // 1 year
          } else if (planName.includes('month')) {
            subscriptionDays = 30; // 1 month
          }

          // Create subscriptions for all tools in the bundle
          const now = new Date();
          const periodEnd = new Date(now);
          periodEnd.setDate(periodEnd.getDate() + subscriptionDays);

          for (const bundleTool of bundle.tools) {
            const toolId = bundleTool.toolId;
            
            // Check if subscription already exists
            const existingSubscription = await prisma.toolSubscription.findUnique({
              where: {
                userId_toolId: {
                  userId: payment.userId,
                  toolId,
                },
              },
            });

            if (existingSubscription) {
              // Update existing subscription - extend period from current end date
              const currentEnd = existingSubscription.currentPeriodEnd > now 
                ? existingSubscription.currentPeriodEnd 
                : now;
              const newPeriodEnd = new Date(currentEnd);
              newPeriodEnd.setDate(newPeriodEnd.getDate() + subscriptionDays);
              
              await prisma.toolSubscription.update({
                where: { id: existingSubscription.id },
                data: {
                  status: 'ACTIVE',
                  activationStatus: 'ACTIVE',
                  currentPeriodStart: existingSubscription.currentPeriodStart < now 
                    ? existingSubscription.currentPeriodStart 
                    : now,
                  currentPeriodEnd: newPeriodEnd,
                  canceledAt: null,
                  cancelAtPeriodEnd: false,
                },
              });
            } else {
              // Create new subscription with SHARED plan (bundles use shared by default)
              await createSubscriptionAfterPayment(
                payment.userId,
                toolId,
                PlanType.SHARED,
                updatedPayment.id
              );

              // Update the subscription period to match bundle plan
              await prisma.toolSubscription.updateMany({
                where: {
                  userId: payment.userId,
                  toolId,
                },
                data: {
                  currentPeriodStart: now,
                  currentPeriodEnd: periodEnd,
                },
              });
            }
          }

          console.log(`Created subscriptions for ${bundle.tools.length} tools in bundle ${bundle.name}`);
        } catch (error: any) {
          console.error('Error creating bundle subscriptions after payment:', error);
          // Don't fail webhook, log error for manual review
        }
      }
    }

    // Return success response to Paygic
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error: any) {
    console.error('Error processing Paygic webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Allow GET for webhook verification (if Paygic requires it)
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Paygic webhook endpoint is active',
  });
}

