import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle, Users, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TrendingBundlesSlider } from "@/components/tools/trending-bundles-slider";
import { ToolNamesSlider } from "@/components/tools/tool-names-slider";
import { IndividualToolsSearch } from "@/components/tools/individual-tools-search";
import { formatPrice, serializeBundle } from "@/lib/utils";
import { getWhatsAppConfig, buildWhatsAppUrl } from "@/lib/whatsapp-config";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let whatsapp = { number: "919155313223", defaultMessage: "Hello! I need help with my subscription." };
  try {
    whatsapp = await getWhatsAppConfig();
  } catch (_e) {
    // Fallback so page never crashes
  }
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
    <div className="min-h-screen bg-white antialiased">
      {/* Hero Section — professional */}
      <section className="relative overflow-hidden pt-24 pb-18 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(124,58,237,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_50%,rgba(59,130,246,0.08),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600 mb-4">
              Premium access for India
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 mb-5 sm:mb-6 max-w-4xl mx-auto leading-tight">
              <span className="block">Premium AI & Work Tools</span>
              <span className="block mt-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Now Affordable for India
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 mb-4 leading-relaxed px-4">
              Smart bundles for content, SEO, video, business & study — without expensive subscriptions.
            </p>
            <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-10 px-4">
              Monthly • 6-Month • Yearly • Instant access • Indian payments
            </p>
            <div className="w-14 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-8 sm:mb-10" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-8">
              <Button
                asChild
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-10 py-6 h-auto font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/tools" className="flex items-center gap-2">
                  Explore Tools
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
            </div>
            {tools.length > 0 && (
              <div className="mt-6 sm:mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
                <ToolNamesSlider tools={tools} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Bundles Slider */}
      {trendingBundles.length > 0 && (
        <section className="relative py-12 sm:py-16 bg-white">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-600 mb-2">Featured</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Trending Bundles</h2>
            </div>
            <TrendingBundlesSlider bundles={trendingBundles.map(b => serializeBundle(b))} />
          </div>
        </section>
      )}

      {/* Bundles Section — professional */}
      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-white to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(124,58,237,0.05),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 mb-2">Save more</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 px-2 mb-2 max-w-3xl mx-auto leading-tight tracking-tight">
              5 Smart AI Bundles
              <span className="block mt-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Built for Real Work in India
              </span>
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-4">
              Curated bundles for content, SEO, design & more — one price, multiple tools.
            </p>
            <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mx-auto" />
          </div>
          {allBundles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {allBundles.map((bundle) => {
                const serializedBundle = serializeBundle(bundle);
                return (
                  <Card
                    key={serializedBundle.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/90 hover:border-purple-200 bg-white shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                  >
                    <div className="relative w-full aspect-[4/3] min-h-[160px] bg-slate-100 overflow-hidden rounded-t-2xl">
                      {serializedBundle.icon && (serializedBundle.icon.startsWith('/') || serializedBundle.icon.startsWith('http')) ? (
                        <img src={serializedBundle.icon} alt={serializedBundle.name} className="absolute inset-0 w-full h-full object-cover object-center" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl bg-gradient-to-br from-slate-100 to-slate-200">
                          {serializedBundle.icon || "📦"}
                        </div>
                      )}
                      <Badge className="absolute top-2.5 right-2.5 bg-purple-600/95 text-white border-0 text-xs font-medium shadow-md rounded-md px-2 py-0.5">
                        Bundle
                      </Badge>
                    </div>
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1.5 line-clamp-1">
                        {serializedBundle.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 leading-snug line-clamp-2">
                        {serializedBundle.shortDescription || serializedBundle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col pt-0 pb-5">
                      {serializedBundle.features && (
                        <div className="space-y-1.5 flex-1">
                          {serializedBundle.features.split(/\n|,/).slice(0, 3).map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                              <span className="line-clamp-1">{feature.trim()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="pt-3 border-t border-slate-100 mt-auto">
                        <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                          {formatPrice(serializedBundle.priceMonthly)}/month
                        </div>
                        <Button
                          asChild
                          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Link href={`/checkout/bundle/${serializedBundle.id}`} className="flex items-center justify-center gap-2 py-3">
                            Buy Now
                            <ArrowRight className="h-4 w-4 shrink-0" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-slate-50/80 border border-slate-200/80">
              <p className="text-slate-600 text-sm">Bundles will be available soon. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* Individual Tools Section — tight spacing */}
      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.06),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600 mb-2">
              Individual access
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 px-2 mb-2 max-w-3xl mx-auto leading-tight">
              Buy Any Premium Tool Individually
              <span className="block mt-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                No Bundle Required
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-2">
              Explore and purchase individual tools instantly, with simple pricing and secure access.
            </p>
            <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4" />
          </div>

          <IndividualToolsSearch tools={tools} />

          <div className="text-center mt-8 sm:mt-10">
            <Button
              asChild
              size="lg"
              className="px-8 sm:px-10 py-6 h-auto text-base sm:text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/tools" className="flex items-center gap-2">
                View All Tools
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Support Section — tight spacing, clear bg */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-emerald-50/80">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 mb-1.5">24/7 support</p>
            <div className="w-10 h-0.5 rounded-full bg-emerald-300 mx-auto" />
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-100 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <MessageCircle className="h-6 w-6 text-[#25D366]" aria-hidden />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Chat with us on WhatsApp
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-snug max-w-md mx-auto mb-6">
              Activation help, support & questions — our team is ready 24/7.
            </p>
            <div className="flex justify-center">
              <a
                href={buildWhatsAppUrl(whatsapp.number, "Hi! I need help with my subscription.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                Contact us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section — professional */}
      <section className="relative py-20 md:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-600 mb-3">Stay updated</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto">
            Tool updates, exclusive offers, and connect with other users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={buildWhatsAppUrl(whatsapp.number, "Hi! I want to join the community for tool updates and offers.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              Join WhatsApp Group
            </a>
            <a
              href="https://t.me/your_telegram_group"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold border border-slate-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Users className="h-5 w-5" />
              Join Telegram Channel
            </a>
          </div>
        </div>
      </section>

      {/* Footer — professional */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
            <div className="md:col-span-1">
              <h3 className="text-white font-bold text-lg mb-4">AliDigitalSolution</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Premium AI tools at unbeatable prices. Trusted by thousands across India.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li>
                  <a href={buildWhatsAppUrl(whatsapp.number)} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    WhatsApp Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} AliDigitalSolution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
