'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  ArrowLeft,
  ExternalLink,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { ToolCategory } from '@prisma/client';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentLinks {
  upiIntent: string;
  phonePe: string;
  paytm: string;
  gpay: string;
  dynamicQR: string;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  category: ToolCategory;
  icon?: string | null;
  toolUrl: string;
  priceMonthly: number;
  isActive: boolean;
}

interface ToolCheckoutClientProps {
  tool: Tool;
}

const categoryLabels: Record<ToolCategory, string> = {
  AI_WRITING: "AI Writing",
  SEO_TOOLS: "SEO & Marketing",
  DESIGN: "Design",
  PRODUCTIVITY: "Productivity",
  CODE_DEV: "Code & Dev",
  VIDEO_AUDIO: "Video & Audio",
  OTHER: "Other",
};

export function ToolCheckoutClient({ tool }: ToolCheckoutClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinks | null>(null);
  const [merchantReferenceId, setMerchantReferenceId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');

  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      setCustomerName(session.user.name || '');
      setCustomerEmail(session.user.email || '');
    }
  }, [session]);

  // Poll payment status
  useEffect(() => {
    if (!merchantReferenceId || paymentStatus !== 'pending') return;

    const interval = setInterval(async () => {
      try {
        setCheckingStatus(true);
        const response = await fetch('/api/payments/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantReferenceId }),
        });

        const data = await response.json();
        
        if (data.success && data.payment.status === 'SUCCESS') {
          setPaymentStatus('success');
          clearInterval(interval);
          // Redirect to success page after 2 seconds
          setTimeout(() => {
            router.push(`/payment/success?ref=${merchantReferenceId}`);
          }, 2000);
        } else if (data.success && data.payment.status === 'FAILED') {
          setPaymentStatus('failed');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setCheckingStatus(false);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [merchantReferenceId, paymentStatus, router]);

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push(`/login?redirect=/checkout/${tool.id}`);
    return null;
  }

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerEmail || !customerMobile) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate mobile number (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(customerMobile.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const amount = tool.priceMonthly / 100; // Convert from cents to rupees
      
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          planName: null,
          amount,
          customerName,
          customerEmail,
          customerMobile: customerMobile.replace(/\D/g, ''),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentLinks(data.payment.paymentLinks);
        setMerchantReferenceId(data.payment.merchantReferenceId);
        setPaymentCreated(true);
      } else {
        alert(data.error || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to create payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  // Calculate pricing with discount
  const originalPrice = tool.priceMonthly * 4; // 4x for 75% discount
  const currentPrice = tool.priceMonthly;
  const discountPercent = 75;
  const displayAmount = `₹${(currentPrice / 100).toLocaleString('en-IN')}`;
  const displayOriginalAmount = `₹${(originalPrice / 100).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-16 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-slate-600">
            Secure payment via UPI, PhonePe, Paytm, or Google Pay
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form / Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tool Info Card */}
            <Card className="glass border-slate-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{tool.icon || '🛠️'}</div>
                    <div>
                      <CardTitle className="text-2xl text-slate-900 mb-2">
                        {tool.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="glass border-slate-200 text-slate-700">
                          {categoryLabels[tool.category] || tool.category}
                        </Badge>
                        <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span>4.9</span>
                        </div>
                      </div>
                      <CardDescription className="text-slate-600">
                        {tool.shortDescription || tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {!paymentCreated ? (
              <Card className="glass border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Payment Details</CardTitle>
                  <CardDescription>
                    Enter your details to proceed with payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="bg-white border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-white border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-slate-700">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value)}
                        placeholder="10-digit mobile number"
                        required
                        maxLength={10}
                        className="bg-white border-slate-300"
                      />
                      <p className="text-xs text-slate-500">
                        Enter your 10-digit mobile number (without +91)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Payment...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center justify-between">
                    <span>Choose Payment Method</span>
                    {checkingStatus && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Checking...
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Select your preferred payment method to complete the transaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* UPI Intent */}
                  {paymentLinks?.upiIntent && (
                    <Button
                      onClick={() => handleUPIPayment(paymentLinks.upiIntent)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white h-auto py-4"
                    >
                      <Smartphone className="h-5 w-5 mr-2" />
                      <div className="text-left flex-1">
                        <div className="font-semibold">Pay with UPI</div>
                        <div className="text-xs opacity-90">Open any UPI app</div>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}

                  {/* PhonePe */}
                  {paymentLinks?.phonePe && (
                    <Button
                      onClick={() => handleUPIPayment(paymentLinks.phonePe)}
                      variant="outline"
                      className="w-full border-slate-300 hover:bg-slate-50 h-auto py-4"
                    >
                      <div className="text-left flex-1">
                        <div className="font-semibold text-slate-900">PhonePe</div>
                        <div className="text-xs text-slate-600">Pay with PhonePe app</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-600" />
                    </Button>
                  )}

                  {/* Paytm */}
                  {paymentLinks?.paytm && (
                    <Button
                      onClick={() => handleUPIPayment(paymentLinks.paytm)}
                      variant="outline"
                      className="w-full border-slate-300 hover:bg-slate-50 h-auto py-4"
                    >
                      <div className="text-left flex-1">
                        <div className="font-semibold text-slate-900">Paytm</div>
                        <div className="text-xs text-slate-600">Pay with Paytm app</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-600" />
                    </Button>
                  )}

                  {/* Google Pay */}
                  {paymentLinks?.gpay && (
                    <Button
                      onClick={() => handleUPIPayment(paymentLinks.gpay)}
                      variant="outline"
                      className="w-full border-slate-300 hover:bg-slate-50 h-auto py-4"
                    >
                      <div className="text-left flex-1">
                        <div className="font-semibold text-slate-900">Google Pay</div>
                        <div className="text-xs text-slate-600">Pay with Google Pay app</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-600" />
                    </Button>
                  )}

                  {/* QR Code */}
                  {paymentLinks?.upiIntent && (
                    <Card className="border-slate-200 bg-white">
                      <CardHeader>
                        <CardTitle className="text-sm text-slate-900 flex items-center">
                          <QrCode className="h-4 w-4 mr-2" />
                          Scan QR Code
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-center mb-4 p-4 bg-white rounded-lg border border-slate-200">
                          <QRCodeSVG
                            value={paymentLinks.upiIntent}
                            size={192}
                            level="H"
                            includeMargin={true}
                            className="rounded-lg"
                          />
                        </div>
                        <p className="text-xs text-center text-slate-600">
                          Scan this QR code with any UPI app to pay
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Payment Status */}
                  {paymentStatus === 'success' && (
                    <div className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">Payment Successful!</span>
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-700 font-medium">Payment Failed</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">
                      Payment link expires in 5 minutes. Please complete the payment before it expires.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="glass border-slate-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-slate-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">{tool.name}</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Monthly subscription
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <div className="text-2xl font-bold text-slate-900">{displayAmount}</div>
                    <div className="text-sm text-slate-500 line-through">
                      {displayOriginalAmount}
                    </div>
                    <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">
                      {discountPercent}% OFF
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 mb-4">per month</div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Secure Payment
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Instant Activation
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    24/7 Support
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

