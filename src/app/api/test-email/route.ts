import { NextResponse } from "next/server";
import { sendEmail, generateOtpEmailHtml } from "@/lib/email";

export async function GET() {
  try {
    const testEmail = process.env.SMTP_USER || 'alidigitalsolution.in@gmail.com';
    const testOtp = '123456';
    
    console.log(`🧪 Testing email send to ${testEmail}...`);
    
    await sendEmail({
      to: testEmail,
      subject: 'Test OTP Email',
      html: generateOtpEmailHtml(testOtp, 'verification'),
    });
    
    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail}. Check your inbox!`,
    });
  } catch (error: any) {
    console.error('Test email failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test email',
    }, { status: 500 });
  }
}
