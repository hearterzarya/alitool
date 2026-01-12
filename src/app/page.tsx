import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle, Users, Zap, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TrendingBundlesSlider } from "@/components/tools/trending-bundles-slider";
import { ToolIcon } from "@/components/tools/tool-icon";
import { ToolNamesSlider } from "@/components/tools/tool-names-slider";
import { IndividualToolsSearch } from "@/components/tools/individual-tools-search";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch trending bundles
  let trendingBundles: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    priceMonthly: number;
    priceSixMonth: number | null;
    priceYearly: number | null;
    features: string | null;
    icon: string | null;
  }> = [];

  // Fetch all bundles
  let allBundles: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    priceMonthly: number;
    priceSixMonth: number | null;
    priceYearly: number | null;
    features: string | null;
    icon: string | null;
  }> = [];

  // Fetch active tools
  let tools: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  }> = [];

  try {
    // Try to fetch bundles (may not exist yet)
    try {
      if ('bundle' in prisma && typeof (prisma as any).bundle?.findMany === 'function') {
        trendingBundles = await (prisma as any).bundle.findMany({
          where: { isActive: true, isTrending: true },
          orderBy: { sortOrder: 'asc' },
          take: 5,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            shortDescription: true,
            priceMonthly: true,
            priceSixMonth: true,
            priceYearly: true,
            features: true,
            icon: true,
          },
        });

        allBundles = await (prisma as any).bundle.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          take: 5,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            shortDescription: true,
            priceMonthly: true,
            priceSixMonth: true,
            priceYearly: true,
            features: true,
            icon: true,
          },
        });
      }
    } catch (error) {
      console.warn('Bundles table may not exist yet:', error);
    }

    tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        description: true,
        sharedPlanFeatures: true,
        privatePlanFeatures: true,
      },
    });
  } catch (error: any) {
    console.error('Database error:', error?.message);
    tools = [];
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50/30 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
              <span className="block">Premium AI & Work Tools</span>
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                — Now Affordable for India IN
              </span>
            </h1>
            
            <p className="mx-auto max-w-3xl text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed">
              Smart bundles for content, SEO, video, business & study — without expensive subscriptions.
            </p>
            <p className="text-lg text-slate-500 mb-12">
              Monthly • 6-Month • Yearly plans • Instant access • Indian payments supported
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-8">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/tools" className="flex items-center gap-2">
                  Explore Tools
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Tool Names Slider */}
            {tools.length > 0 && (
              <div className="mt-4 sm:mt-6 md:mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
                <ToolNamesSlider tools={tools} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Bundles Slider */}
      {trendingBundles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TrendingBundlesSlider bundles={trendingBundles} />
          </div>
        </section>
      )}

      {/* Bundles Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              5 Smart AI Bundles — Built for Real Work in India
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4"></div>
          </div>

          {allBundles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allBundles.map((bundle) => (
                <Card 
                  key={bundle.id}
                  className="group relative overflow-hidden border-2 border-slate-200 hover:border-purple-300 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{bundle.icon || "📦"}</div>
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                        Bundle
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">{bundle.name}</CardTitle>
                    <CardDescription className="text-base">
                      {bundle.shortDescription || bundle.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bundle.features && (
                      <div className="space-y-2">
                        {bundle.features.split(/\n|,/).slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{feature.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="text-3xl font-bold text-slate-900 mb-2">
                        ₹{(bundle.priceMonthly / 100).toLocaleString('en-IN')}/month
                      </div>
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Link href={`/checkout/bundle/${bundle.id}`}>
                          Buy Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Bundles will be available soon. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* Individual Tools Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              Buy Any Premium Tool Individually — No Bundle Required
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore and purchase individual tools instantly, with simple pricing and secure access.
            </p>
          </div>

          <IndividualToolsSearch tools={tools} />

          <div className="text-center">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 h-auto text-lg border-2 border-purple-500 text-purple-700 hover:bg-purple-50 hover:border-purple-600 transition-all"
            >
              <Link href="/tools" className="flex items-center gap-2">
                View All Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Support Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200">
            <MessageCircle className="h-16 w-16 text-[#25D366] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Chat with us on WhatsApp for activation & support
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Need help? Have questions? Our team is ready to assist you 24/7 via WhatsApp.
            </p>
            <a
              href="https://wa.me/919876543210?text=Hi! I need help with my subscription."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
              Contact us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Get tool updates, exclusive offers, and connect with other users
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210?text=Hi! I want to join the community for tool updates and offers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              Join WhatsApp Group
            </a>
            <a
              href="https://t.me/your_telegram_group"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Users className="h-5 w-5" />
              Join Telegram Channel
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">AliDigitalSolution</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Premium AI tools at unbeatable prices. Trusted by thousands of users across India.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/tools" className="hover:text-white transition">Tools</Link></li>
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    WhatsApp Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} AliDigitalSolution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
