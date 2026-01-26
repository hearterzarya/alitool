import { NextResponse } from "next/server";
import { sendEmail, generateOtpEmailHtml } from "@/lib/email";

export async function GET(req: Request) {
  try {
    // Get email from query parameter or use default
    const { searchParams } = new URL(req.url);
    const testEmail = searchParams.get('email') || process.env.SMTP_USER || 'alidigitalsolution.in@gmail.com';
    const testOtp = '123456';
    
    console.log(`🧪 Testing email send via ${process.env.EMAIL_PROVIDER || 'resend'} to ${testEmail}...`);
    
    await sendEmail({
      to: testEmail,
      subject: 'Test OTP Email - AliDigitalSolution',
      html: generateOtpEmailHtml(testOtp, 'verification'),
    });
    
    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail} via ${process.env.EMAIL_PROVIDER || 'resend'}. Check your inbox!`,
      provider: process.env.EMAIL_PROVIDER || 'resend',
    });
  } catch (error: any) {
    console.error('Test email failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test email',
      provider: process.env.EMAIL_PROVIDER || 'resend',
    }, { status: 500 });
  }
}
