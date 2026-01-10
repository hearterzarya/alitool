import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  createPaygicToken,
  createPaygicPayment,
  generateMerchantReferenceId,
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
      
      // Use the provided amount (which includes plan-specific pricing)
      // Only fallback to tool.priceMonthly if amount is not provided or invalid
      if (!amount || amount <= 0) {
        finalAmount = tool.priceMonthly / 100; // Convert from paise to rupees
        console.log('Using tool default price (no plan specified):', {
          toolId: tool.id,
          toolName: tool.name,
          priceMonthly: tool.priceMonthly,
          priceInRupees: finalAmount,
        });
      } else {
        // Use the plan-specific amount provided by the client
        finalAmount = amount;
        console.log('Using plan-specific price:', {
          toolId: tool.id,
          toolName: tool.name,
          planName: planName,
          planPriceInRupees: finalAmount,
          toolDefaultPrice: tool.priceMonthly / 100,
          sharedPlanPrice: tool.sharedPlanPrice ? tool.sharedPlanPrice / 100 : null,
          privatePlanPrice: tool.privatePlanPrice ? tool.privatePlanPrice / 100 : null,
        });
      }
    }

    // Generate unique merchant reference ID
    const merchantReferenceId = generateMerchantReferenceId();

    // Create Paygic token
    const token = await createPaygicToken();

    // Paygic expects amount in rupees (as a string)
    // Use finalAmount which is already in rupees
    const amountInRupees = Math.round(finalAmount * 100) / 100; // Round to 2 decimal places
    const amountForPaygic = amountInRupees.toString();
    
    console.log('Payment creation:', {
      amountInRupees: finalAmount,
      amountForPaygic,
      toolId,
      toolPriceMonthly: tool?.priceMonthly,
      originalProvidedAmount: amount,
    });
    
    // Validate minimum amount for Paygic (minimum ₹1)
    if (amountInRupees < 1) {
      return NextResponse.json(
        { error: 'Amount too small. Minimum payment is ₹1' },
        { status: 400 }
      );
    }

    // Create payment request with Paygic
    const paygicResponse = await createPaygicPayment(token, {
      mid: process.env.PAYGIC_MERCHANT_ID!,
      amount: amountForPaygic,
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

