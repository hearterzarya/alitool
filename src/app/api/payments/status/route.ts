import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPaygicToken, checkPaygicStatus } from '@/lib/paygic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { merchantReferenceId } = body;

    if (!merchantReferenceId) {
      return NextResponse.json(
        { error: 'Merchant reference ID is required' },
        { status: 400 }
      );
    }

    // Get payment from database
    const payment = await prisma.payment.findUnique({
      where: { merchantReferenceId },
      include: { user: true, tool: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify user owns this payment
    if (payment.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // If already successful, return cached status
    if (payment.status === 'SUCCESS') {
      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          merchantReferenceId: payment.merchantReferenceId,
          status: payment.status,
          amount: payment.amount,
          successDate: payment.successDate,
        },
      });
    }

    // Check status with Paygic
    const token = payment.paygicToken || await createPaygicToken();
    const statusResponse = await checkPaygicStatus(token, merchantReferenceId);

    // Update payment status in database
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: statusResponse.txnStatus === 'SUCCESS' ? 'SUCCESS' : 
                statusResponse.txnStatus === 'FAILED' ? 'FAILED' : 
                statusResponse.txnStatus === 'EXPIRED' ? 'EXPIRED' : 'PENDING',
        txnStatus: statusResponse.txnStatus,
        paygicReferenceId: statusResponse.data?.paygicReferenceId || payment.paygicReferenceId,
        successDate: statusResponse.data?.successDate 
          ? new Date(statusResponse.data.successDate) 
          : payment.successDate,
      },
    });

    // If payment is successful, create subscription
    if (statusResponse.txnStatus === 'SUCCESS' && updatedPayment.status === 'SUCCESS') {
      // Check if subscription already exists
      if (updatedPayment.toolId) {
        const existingSubscription = await prisma.toolSubscription.findUnique({
          where: {
            userId_toolId: {
              userId: payment.userId,
              toolId: updatedPayment.toolId,
            },
          },
        });

        if (!existingSubscription) {
          // Create subscription for 30 days
          const now = new Date();
          const periodEnd = new Date(now);
          periodEnd.setDate(periodEnd.getDate() + 30);

          await prisma.toolSubscription.create({
            data: {
              userId: payment.userId,
              toolId: updatedPayment.toolId,
              status: 'ACTIVE',
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: updatedPayment.id,
        merchantReferenceId: updatedPayment.merchantReferenceId,
        status: updatedPayment.status,
        txnStatus: updatedPayment.txnStatus,
        amount: updatedPayment.amount,
        successDate: updatedPayment.successDate,
      },
    });
  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

