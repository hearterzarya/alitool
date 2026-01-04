'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get('ref');
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    if (!ref) {
      router.push('/');
      return;
    }

    // Fetch payment details
    const fetchPayment = async () => {
      try {
        const response = await fetch('/api/payments/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantReferenceId: ref }),
        });

        const data = await response.json();
        if (data.success) {
          setPaymentData(data.payment);
        }
      } catch (error) {
        console.error('Error fetching payment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [ref, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-16 pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Card className="glass border-slate-200 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-slate-900 mb-2">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentData && (
              <div className="bg-slate-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-slate-900">
                    {paymentData.merchantReferenceId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-semibold text-slate-900">
                    ₹{(paymentData.amount / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                {paymentData.successDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Date:</span>
                    <span className="text-slate-900">
                      {new Date(paymentData.successDate).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-slate-700">
                Your subscription has been activated! You can now access all premium features.
              </p>
              <p className="text-sm text-slate-600">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Link href="/tools">Browse Tools</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

