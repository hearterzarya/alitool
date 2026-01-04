import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  createPaygicToken,
  createPaygicPayment,
  generateMerchantReferenceId,
  convertToPaise,
} from '@/lib/paygic';

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
    const { toolId, planName, amount, customerName, customerEmail, customerMobile } = body;

    // Validate required fields
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerMobile) {
      return NextResponse.json(
        { error: 'Customer email and mobile are required' },
        { status: 400 }
      );
    }

    // Validate toolId if provided (for individual tool purchases)
    if (toolId) {
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
      });

      if (!tool) {
        return NextResponse.json(
          { error: 'Tool not found' },
          { status: 404 }
        );
      }
    }

    // Generate unique merchant reference ID
    const merchantReferenceId = generateMerchantReferenceId();

    // Create Paygic token
    const token = await createPaygicToken();

    // Convert amount to paise (Paygic expects amount in paise)
    const amountInPaise = convertToPaise(amount);

    // Create payment request with Paygic
    const paygicResponse = await createPaygicPayment(token, {
      mid: process.env.PAYGIC_MERCHANT_ID!,
      amount: amountInPaise,
      merchantReferenceId,
      customer_name: customerName || session.user.name || 'Customer',
      customer_email: customerEmail,
      customer_mobile: customerMobile,
    });

    // Save payment to database
    const payment = await prisma.payment.create({
      data: {
        userId: (session.user as any).id,
        toolId: toolId || null,
        planName: planName || null,
        amount: Math.round(amount * 100), // Store in paise
        merchantReferenceId,
        paygicToken: token,
        upiIntent: paygicResponse.data.intent,
        phonePeLink: paygicResponse.data.phonePe,
        paytmLink: paygicResponse.data.paytm,
        gpayLink: paygicResponse.data.gpay,
        dynamicQR: paygicResponse.data.dynamicQR,
        customerName: customerName || session.user.name || null,
        customerEmail,
        customerMobile,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        merchantReferenceId: payment.merchantReferenceId,
        amount: payment.amount,
        status: payment.status,
        paymentLinks: {
          upiIntent: paygicResponse.data.intent,
          phonePe: paygicResponse.data.phonePe,
          paytm: paygicResponse.data.paytm,
          gpay: paygicResponse.data.gpay,
          dynamicQR: paygicResponse.data.dynamicQR,
        },
        expiresAt: payment.expiresAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}

