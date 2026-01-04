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
    // Amount can be less than 1 rupee (e.g., 0.01 for 1 paise)
    if (!amount || amount <= 0) {
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
    let tool = null;
    let finalAmount = amount;
    
    if (toolId) {
      tool = await prisma.tool.findUnique({
        where: { id: toolId },
      });

      if (!tool) {
        return NextResponse.json(
          { error: 'Tool not found' },
          { status: 404 }
        );
      }
      
      // For tool purchases, ALWAYS use the tool's priceMonthly to ensure consistency
      // This prevents any conversion errors or mismatches
      finalAmount = tool.priceMonthly / 100; // Convert from paise to rupees
      console.log('Using tool price:', {
        toolId: tool.id,
        toolName: tool.name,
        priceMonthly: tool.priceMonthly,
        priceInRupees: finalAmount,
        providedAmount: amount,
      });
    }

    // Generate unique merchant reference ID
    const merchantReferenceId = generateMerchantReferenceId();

    // Create Paygic token
    const token = await createPaygicToken();

    // Convert amount to paise (Paygic expects amount in paise)
    // Use finalAmount which is either the provided amount or the tool's price
    const amountInPaise = convertToPaise(finalAmount);
    
    console.log('Payment creation:', {
      amountInRupees: finalAmount,
      amountInPaise,
      toolId,
      toolPriceMonthly: tool?.priceMonthly,
      originalProvidedAmount: amount,
    });
    
    // Validate minimum amount for Paygic (minimum 1 paise)
    if (parseInt(amountInPaise) < 1) {
      return NextResponse.json(
        { error: 'Amount too small. Minimum payment is ₹0.01 (1 paise)' },
        { status: 400 }
      );
    }

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
        amount: Math.round(finalAmount * 100), // Store in paise
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

