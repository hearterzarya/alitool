'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Clock, Users, TrendingUp, Sparkles, Zap, Star, HelpCircle, DollarSign } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Starter Bundle",
      description: "Perfect for students and beginners who need essential AI tools",
      monthlyPrice: 999,
      yearlyPrice: 9990,
      originalMonthly: 1650,
      originalYearly: 19800,
      discount: 39,
      savings: 651,
      userCount: "2,000+",
      badge: null,
      daysLeft: 3,
      features: [
        "Generate 10x more content in half the time with Jasper AI",
        "Make any AI content completely undetectable with Hix Bypass",
        "Get instant expert-level research with Perplexity AI",
        "Save ₹651 compared to individual subscriptions",
        "Complete setup in under 5 minutes",
        "24/7 email support with guaranteed response",
        "Personal use license included",
        "Unified dashboard for seamless tool management",
        "Bank-grade security with secure UPI payments",
      ],
      cta: "Start Saving Now",
      highlight: "Limited Time: Save 39%",
    },
    {
      name: "Pro Bundle",
      description: "Best for freelancers and content creators - Most Popular Choice",
      monthlyPrice: 1499,
      yearlyPrice: 14990,
      originalMonthly: 2500,
      originalYearly: 30000,
      discount: 40,
      savings: 1001,
      userCount: "8,500+",
      badge: "Most Popular - 70% Choose This",
      daysLeft: 2,
      features: [
        "Complete content creation workflow - Save ₹1,001 monthly",
        "ChatGPT Plus: Get expert-level answers and content generation",
        "Stealth Writer: Create 100% human-like, undetectable content",
        "Hix Bypass: Transform any AI text into human-quality writing",
        "Grammarly Premium: Perfect grammar and professional tone",
        "Jasper AI: Generate high-converting marketing copy instantly",
        "30-day full access with zero restrictions",
        "Priority WhatsApp support - 2-hour response guarantee",
        "Lightning-fast setup in 3 minutes or less",
        "Smart tool recommendations based on your usage",
        "Advanced analytics to track productivity gains",
        "Exclusive renewal discounts up to 25% off",
        "Monthly strategy calls with AI experts",
      ],
      cta: "Claim 40% Discount",
      highlight: "BESTSELLER - Save ₹1,001",
    },
    {
      name: "Elite Bundle",
      description: "For businesses and agencies who need everything - Complete package",
      monthlyPrice: 2499,
      yearlyPrice: 24990,
      originalMonthly: 5000,
      originalYearly: 60000,
      discount: 50,
      savings: 2501,
      userCount: "1,200+",
      badge: null,
      daysLeft: 1,
      features: [
        "Complete business toolkit - Save ₹2,501 every month",
        "Everything from Pro Bundle + 20 premium business tools",
        "Entertainment suite: Netflix, Spotify, Prime Video access",
        "Professional SEO arsenal: Ahrefs, SEMrush, Moz Pro",
        "Creative powerhouse: Adobe Creative Suite, Canva Pro",
        "Team productivity: Notion, Figma, Slack Premium",
        "Unrestricted 30-day access to entire catalog",
        "Dedicated account manager for personalized support",
        "VIP phone support with same-day resolution",
        "Early access to new tools (2-week head start)",
        "Custom tool requests and enterprise integrations",
        "Multi-user sharing for teams up to 10 members",
        "Free onboarding and training sessions included",
        "ROI tracking and business impact reporting",
      ],
      cta: "Unlock Elite Access",
      highlight: "ENTERPRISE - Save ₹2,501",
    },
  ];

  const stats = [
    { value: "12,000+", label: "Active Users", icon: Users },
    { value: "95%", label: "Satisfaction Rate", icon: TrendingUp },
    { value: "₹2.1L+", label: "Saved Monthly", icon: DollarSign },
    { value: "4.9/5", label: "User Rating", icon: Star },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "Premium AI Tools",
      description: "Access to the most advanced AI tools and technologies for maximum productivity.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Get dedicated support from our AI specialists to maximize your tool usage.",
    },
    {
      icon: Clock,
      title: "Flexible Billing",
      description: "Monthly or yearly billing options. Upgrade or downgrade anytime without hassle.",
    },
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes are prorated and you only pay the difference.",
    },
    {
      question: "What is your refund policy?",
      answer: "All sales are final with no refunds. However, we provide account warranty - if any tool stops working, we'll replace it free of charge. Quality guaranteed!",
    },
    {
      question: "How quickly will I receive access?",
      answer: "All accounts are delivered within 10 seconds of payment confirmation. You'll receive login credentials via email and WhatsApp for instant access.",
    },
    {
      question: "Can I share accounts with my team?",
      answer: "Elite Bundle includes team sharing for up to 10 members. Starter and Pro are for personal use only, but you can upgrade anytime.",
    },
    {
      question: "What if the tools don't work as expected?",
      answer: "We provide 24/7 technical support and guarantee 99.9% uptime. If any tool fails, we'll replace it immediately at no extra cost.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-16">
      {/* Header */}
      <section className="relative overflow-hidden gradient-bg py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 via-blue-100/30 to-slate-100/30 animate-gradient" />
        <div className="absolute inset-0 bg-grid-slate-300/[0.03] bg-[size:75px_75px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300 text-orange-700 animate-pulse">
              Special Launch Pricing - Ends in 3 Days!
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-slate-900">
              Choose Your Perfect <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto mb-8">
              Join 12,000+ satisfied users saving thousands monthly on premium AI tools.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="secondary" className="glass border-slate-200 text-slate-700">
                <CheckCircle2 className="h-3 w-3 mr-2" />
                Instant access
              </Badge>
              <Badge variant="secondary" className="glass border-slate-200 text-slate-700">
                <Shield className="h-3 w-3 mr-2" />
                Account warranty
              </Badge>
              <Badge variant="secondary" className="glass border-slate-200 text-slate-700">
                <Zap className="h-3 w-3 mr-2" />
                No setup fees
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "12,000+", label: "Users" },
              { value: "Bank-Grade", label: "Security" },
              { value: "Account", label: "Warranty" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'glass border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'glass border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Yearly
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                Save 39%
              </Badge>
            </button>
          </div>
          {billingCycle === 'yearly' && (
            <p className="text-center text-sm text-slate-600 mb-4 animate-fade-in-up">
              3 days left at this price
            </p>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, idx) => {
              const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              const originalPrice = billingCycle === 'monthly' ? plan.originalMonthly : plan.originalYearly;
              const isPopular = plan.badge?.includes('Most Popular');

              return (
                <Card
                  key={plan.name}
                  className={`relative overflow-hidden glass border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up ${
                    isPopular
                      ? 'border-purple-500/50 bg-gradient-to-br from-purple-100/30 to-blue-100/30'
                      : 'border-slate-200'
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-medium">
                      {plan.badge}
                    </div>
                  )}
                  
                  <CardHeader className={isPopular ? 'pt-12' : ''}>
                    {plan.badge && !isPopular && (
                      <Badge className="mb-3 bg-orange-100 text-orange-700 border-orange-300 w-fit">
                        {plan.badge}
                      </Badge>
                    )}
                    {plan.daysLeft && (
                      <Badge className="mb-3 bg-red-100 text-red-700 border-red-300 w-fit">
                        {plan.daysLeft} {plan.daysLeft === 1 ? 'day' : 'days'} left at this price
                      </Badge>
                    )}
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-600 mb-4">{plan.description}</CardDescription>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <Users className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600">{plan.userCount} Users</span>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline space-x-2">
                        <div className="text-4xl font-bold gradient-text">
                          ₹{currentPrice.toLocaleString()}
                        </div>
                        <div className="text-lg text-slate-500 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        {billingCycle === 'monthly' ? 'per month' : 'per year'}
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        Save ₹{plan.savings.toLocaleString()}/{billingCycle === 'monthly' ? 'month' : 'year'}
                      </Badge>
                    </div>

                    {plan.highlight && (
                      <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300 text-purple-700 w-fit">
                        {plan.highlight}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent>
                    <Button
                      asChild
                      className={`w-full mb-6 ${
                        isPopular
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                          : 'glass border border-slate-300 text-slate-700 hover:bg-slate-50'
                      } transition-all duration-300 hover:scale-105`}
                    >
                      <Link href={`/checkout?plan=${encodeURIComponent(plan.name)}&amount=${currentPrice}`}>
                        {plan.cta}
                      </Link>
                    </Button>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 text-sm mb-3">What you'll achieve:</h4>
                      {plan.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              Trusted by 12,000+ Users Worldwide
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="text-center glass rounded-xl p-6 border border-slate-200 hover:bg-slate-50 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <Icon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              Why GrowTools Beats Individual Subscriptions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={idx}
                  className="glass border border-slate-200 text-center hover:border-purple-500/50 hover:bg-slate-50 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700">
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Pricing FAQs</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="glass border border-slate-200 hover:border-purple-500/50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <CardTitle className="text-lg text-slate-900">{faq.question}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

