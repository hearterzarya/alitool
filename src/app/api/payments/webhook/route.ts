import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSubscriptionAfterPayment } from '@/lib/subscription-utils';

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
      include: { user: true, tool: true },
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
        // Get plan type from payment (SHARED or PRIVATE)
        const planType = ((updatedPayment as any).planType || 'SHARED') as 'SHARED' | 'PRIVATE';
        
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

