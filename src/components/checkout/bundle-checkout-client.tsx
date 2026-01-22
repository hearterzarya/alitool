'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ToolIcon } from '@/components/tools/tool-icon';

interface BundleTool {
  id: string;
  tool: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
}

interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  priceMonthly: number;
  priceSixMonth?: number | null;
  priceYearly?: number | null;
  features?: string | null;
  icon?: string | null;
  tools: BundleTool[];
}

interface BundleCheckoutClientProps {
  bundle: Bundle;
}

export function BundleCheckoutClient({ bundle }: BundleCheckoutClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'sixMonth' | 'yearly'>('monthly');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [paymentLinks, setPaymentLinks] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [merchantReferenceId, setMerchantReferenceId] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

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
    }, 3000);

    return () => clearInterval(interval);
  }, [merchantReferenceId, paymentStatus, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push(`/login?redirect=/checkout/bundle/${bundle.id}`);
    return null;
  }

  const getPrice = () => {
    switch (selectedPlan) {
      case 'sixMonth':
        return bundle.priceSixMonth || bundle.priceMonthly * 6;
      case 'yearly':
        return bundle.priceYearly || bundle.priceMonthly * 12;
      default:
        return bundle.priceMonthly;
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus('idle');

    try {
      // Convert price from paise to rupees for payment API
      const priceInPaise = getPrice();
      const priceInRupees = priceInPaise / 100;

      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundleId: bundle.id,
          planName: `${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`,
          amount: priceInRupees, // Send in rupees, not paise
          customerName,
          customerEmail,
          customerMobile,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentLinks(data.paymentLinks);
        setMerchantReferenceId(data.merchantReferenceId);
        setPaymentStatus('pending');
      } else {
        setPaymentStatus('failed');
        alert(data.error || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setPaymentStatus('failed');
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseFeatures = (features: string | null | undefined) => {
    if (!features) return [];
    return features.split(/\n|,/).map(f => f.trim()).filter(f => f.length > 0);
  };

  const features = parseFeatures(bundle.features);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-16 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bundle Info */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{bundle.icon || "📦"}</div>
                  <div>
                    <CardTitle className="text-3xl">{bundle.name}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {bundle.shortDescription || bundle.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">Bundle Features:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bundle.tools.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Included Tools:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {bundle.tools.map((bundleTool) => (
                        <div
                          key={bundleTool.id}
                          className="flex flex-col items-center p-4 rounded-lg bg-slate-50 border border-slate-200"
                        >
                          <ToolIcon
                            icon={bundleTool.tool.icon}
                            name={bundleTool.tool.name}
                            size="lg"
                          />
                          <span className="text-sm font-medium text-slate-700 mt-2 text-center">
                            {bundleTool.tool.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <CardDescription>Select your plan and complete payment</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Plan Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Select Plan
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('monthly')}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === 'monthly'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold">Monthly</div>
                      <div className="text-sm text-slate-600">
                        {formatPrice(bundle.priceMonthly)}/month
                      </div>
                    </button>
                    {bundle.priceSixMonth && (
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('sixMonth')}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedPlan === 'sixMonth'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-semibold">6-Month</div>
                        <div className="text-sm text-slate-600">
                          {formatPrice(bundle.priceSixMonth)} (Save {Math.round((1 - bundle.priceSixMonth / (bundle.priceMonthly * 6)) * 100)}%)
                        </div>
                      </button>
                    )}
                    {bundle.priceYearly && (
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('yearly')}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedPlan === 'yearly'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-semibold">Yearly</div>
                        <div className="text-sm text-slate-600">
                          {formatPrice(bundle.priceYearly)} (Save {Math.round((1 - bundle.priceYearly / (bundle.priceMonthly * 12)) * 100)}%)
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Details Form */}
                {paymentStatus === 'idle' && (
                  <form onSubmit={handleCreatePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerMobile}
                        onChange={(e) => setCustomerMobile(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-slate-900">Total</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {formatPrice(getPrice())}
                        </span>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Proceed to Payment
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Payment Links */}
                {paymentStatus === 'pending' && paymentLinks && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 mb-4">
                        Choose your preferred payment method:
                      </p>
                      <div className="space-y-2">
                        {paymentLinks.upiIntent && (
                          <a
                            href={paymentLinks.upiIntent}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-medium transition-colors"
                          >
                            Pay via UPI
                          </a>
                        )}
                        {paymentLinks.phonePeLink && (
                          <a
                            href={paymentLinks.phonePeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-center font-medium transition-colors"
                          >
                            Pay via PhonePe
                          </a>
                        )}
                        {paymentLinks.paytmLink && (
                          <a
                            href={paymentLinks.paytmLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center font-medium transition-colors"
                          >
                            Pay via Paytm
                          </a>
                        )}
                        {paymentLinks.gpayLink && (
                          <a
                            href={paymentLinks.gpayLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-center font-medium transition-colors"
                          >
                            Pay via Google Pay
                          </a>
                        )}
                        {paymentLinks.dynamicQR && (
                          <div className="mt-4">
                            <p className="text-sm text-slate-600 mb-2">Or scan QR code:</p>
                            <img
                              src={paymentLinks.dynamicQR}
                              alt="Payment QR Code"
                              className="w-full rounded-lg border border-slate-200"
                            />
                          </div>
                        )}
                      </div>
                      {checkingStatus && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Checking payment status...
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">Payment Successful!</p>
                    <p className="text-sm text-green-600 mt-1">Redirecting...</p>
                  </div>
                )}

                {paymentStatus === 'failed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-red-800 font-medium">Payment Failed</p>
                    <p className="text-sm text-red-600 mt-1">Please try again.</p>
                    <Button
                      onClick={() => {
                        setPaymentStatus('idle');
                        setPaymentLinks(null);
                      }}
                      className="mt-4 w-full"
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
