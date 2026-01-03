import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, CreditCard, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px] dark:bg-grid-slate-400/[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Access 10+ Premium AI Tools
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
              Supercharge Your Workflow
              <br />
              <span className="text-primary">with Premium AI Tools</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300 mb-10">
              Get instant access to ChatGPT Plus, Claude Pro, Midjourney, and more.
              Subscribe once, access everything. Starting at just $5/month.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="text-base">
                <Link href="/tools">
                  Browse Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-3xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Premium Tools</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">$5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Starting Price</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Instant Access</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Preview */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Tools</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Access the most powerful AI tools with a single subscription
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                name: "ChatGPT Plus",
                description: "Access to GPT-4 with faster response times",
                price: "$8/mo",
                popular: true,
              },
              {
                icon: "🎨",
                name: "Claude Pro",
                description: "Extended context and priority access",
                price: "$10/mo",
                popular: true,
              },
              {
                icon: "🎨",
                name: "Midjourney",
                description: "AI image generation with stunning quality",
                price: "$15/mo",
                popular: false,
              },
            ].map((tool, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {tool.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                      Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="text-4xl mb-2">{tool.icon}</div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{tool.price}</span>
                    <Button asChild size="sm">
                      <Link href="/tools">Subscribe</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/tools">View All Tools →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose GrowTools?</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Everything you need to access premium AI tools, simplified
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Access",
                description: "Get immediate access to all subscribed tools. No waiting, no setup required.",
              },
              {
                icon: <CreditCard className="h-8 w-8" />,
                title: "Flexible Billing",
                description: "Pay monthly for each tool you need. Cancel anytime with no questions asked.",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure & Reliable",
                description: "Your data is encrypted and protected. 99.9% uptime guarantee.",
              },
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "Always Updated",
                description: "Access the latest features and models as soon as they're released.",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who are already using premium AI tools to supercharge their productivity.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link href="/tools">Browse All Tools</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base bg-transparent hover:bg-primary-foreground/10 border-primary-foreground/20">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">GrowTools</h3>
              <p className="text-sm text-gray-400">
                Access premium AI tools with affordable monthly subscriptions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools" className="hover:text-white transition">Tools</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 GrowTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
