import { sendEmail, generateOrderConfirmationEmailHtml, generateBundleOrderConfirmationEmailHtml } from './email';
import { prisma } from './prisma';

/**
 * Send order confirmation email after successful payment
 */
export async function sendOrderConfirmationEmail(paymentId: string): Promise<void> {
  try {
    // Fetch payment with all related data
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true,
        tool: true,
        bundle: {
          include: {
            tools: {
              include: {
                tool: true,
              },
            },
          },
        },
      },
    });

    if (!payment || !payment.user) {
      console.error('Payment or user not found for order confirmation email');
      return;
    }

    // Only send email for successful payments
    if (payment.status !== 'SUCCESS') {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      'https://alidigitalsolution.in';
    const dashboardUrl = `${baseUrl}/dashboard`;

    const customerName = payment.user.name || payment.user.email.split('@')[0];
    const orderNumber = payment.merchantReferenceId;
    const amount = payment.amount;
    const paymentDate = payment.successDate || payment.createdAt;

    if (payment.toolId && payment.tool) {
      // Single tool purchase
      const planType = (payment.planType || 'SHARED') as 'SHARED' | 'PRIVATE';
      
      // Get subscription details if available
      const subscription = await prisma.toolSubscription.findFirst({
        where: {
          userId: payment.userId,
          toolId: payment.toolId,
        },
        include: {
          sharedCredentials: true,
          privateCredentials: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const activationStatus = subscription?.activationStatus || 'PENDING';
      let credentials: { email: string; password: string } | undefined;

      if (subscription && activationStatus === 'ACTIVE') {
        if (planType === 'SHARED' && subscription.sharedCredentials) {
          const password = subscription.sharedCredentials.password;
          // Only include credentials if they're not placeholders
          if (password && !password.includes('PLACEHOLDER') && !password.includes('@example.com')) {
            credentials = {
              email: subscription.sharedCredentials.email,
              password: password, // May be encrypted - will be shown as-is
            };
          }
        } else if (planType === 'PRIVATE' && subscription.privateCredentials) {
          const password = subscription.privateCredentials.password;
          // Only include credentials if they're not placeholders
          if (password && !password.includes('PLACEHOLDER')) {
            credentials = {
              email: subscription.privateCredentials.email,
              password: password, // May be encrypted - will be shown as-is
            };
          }
        }
      }

      await sendEmail({
        to: payment.user.email,
        subject: `Order Confirmation - ${payment.tool.name}`,
        html: generateOrderConfirmationEmailHtml({
          customerName,
          orderNumber,
          toolName: payment.tool.name,
          planType,
          amount,
          paymentDate,
          activationStatus: activationStatus as 'ACTIVE' | 'PENDING',
          credentials,
          dashboardUrl,
        }),
      });
    } else if (payment.bundleId && payment.bundle) {
      // Bundle purchase
      const tools = payment.bundle.tools.map(bt => ({
        name: bt.tool.name,
      }));

      await sendEmail({
        to: payment.user.email,
        subject: `Bundle Order Confirmation - ${payment.bundle.name}`,
        html: generateBundleOrderConfirmationEmailHtml({
          customerName,
          orderNumber,
          bundleName: payment.bundle.name,
          tools,
          planName: payment.planName || 'Monthly Plan',
          amount,
          paymentDate,
          dashboardUrl,
        }),
      });
    }
  } catch (error: any) {
    // Don't fail payment processing if email fails
    console.error('Failed to send order confirmation email:', error);
  }
}
