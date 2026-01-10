import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, CheckCircle2, Clock, DollarSign, Headphones, CheckCircle, MessageCircle, Users, Zap, Star, Sparkles, TrendingUp, Lock, Rocket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ToolIcon } from "@/components/tools/tool-icon";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch active tools for display with error handling
  let tools: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  }> = [];
  let totalTools = 0;
  let totalUsers = 0;

  try {
    tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 12,
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });

    totalTools = await prisma.tool.count({ where: { isActive: true } });
    totalUsers = await prisma.user.count();
  } catch (error: any) {
    console.error('Database error:', error?.message);
    
    // Check if it's a table missing error
    const isTableMissing = error?.message?.includes('does not exist') || 
                           error?.code === 'P2021' ||
                           error?.message?.includes('table');
    
    if (isTableMissing) {
      console.warn('⚠️ Database tables not found. Please run: npm run db:setup');
    }
    
    // Fallback data for display (allows page to render even if DB is not set up)
    tools = [
      { id: '1', name: 'ChatGPT Plus', slug: 'chatgpt-plus', icon: '🤖' },
      { id: '2', name: 'Claude Pro', slug: 'claude-pro', icon: '🧠' },
      { id: '3', name: 'Grammarly', slug: 'grammarly', icon: '✍️' },
      { id: '4', name: 'Canva Pro', slug: 'canva-pro', icon: '🎨' },
      { id: '5', name: 'Midjourney', slug: 'midjourney', icon: '🖼️' },
      { id: '6', name: 'Semrush', slug: 'semrush', icon: '📊' },
    ];
    totalTools = 50;
    totalUsers = 50000;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50/30 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[size:40px_40px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 text-purple-700 text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Trusted by {totalUsers.toLocaleString()}+ users across India</span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-6">
              <span className="block">Premium AI Tools</span>
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                at Unbeatable Prices
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="mx-auto max-w-3xl text-xl sm:text-2xl text-slate-600 mb-12 leading-relaxed">
              Access ChatGPT Pro, Claude, Grammarly, Canva Pro, and {totalTools}+ premium tools instantly. 
              <span className="block mt-2 text-lg text-slate-500">
                Secure payments • 10-second delivery • 24/7 support
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/tools" className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Explore Tools
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-white/80 backdrop-blur-sm border-2 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 transition-all duration-300"
              >
                <Link href="/tools">View Pricing</Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: `${totalUsers.toLocaleString()}+`, label: 'Active Users', icon: Users, color: 'from-blue-500 to-cyan-500' },
                { value: '100%', label: 'Secure', icon: Shield, color: 'from-green-500 to-emerald-500' },
                { value: '10s', label: 'Delivery', icon: Zap, color: 'from-orange-500 to-amber-500' },
                { value: '4.9/5', label: 'Rating', icon: Star, color: 'from-pink-500 to-rose-500' },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Showcase Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-purple-100 text-purple-700 border-purple-200">
              Premium Tools Collection
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              Access {totalTools}+ Premium AI Tools
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From AI writing assistants to design tools, get instant access to the tools that power modern businesses
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {tools.map((tool, idx) => (
              <Link
                key={tool.id}
                href={`/tools#${tool.slug}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ToolIcon icon={tool.icon} name={tool.name} size="xl" />
                </div>
                <div className="text-sm font-semibold text-center text-slate-700 group-hover:text-purple-600 transition-colors">
                  {tool.name}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 h-auto text-lg border-2 border-purple-500 text-purple-700 hover:bg-purple-50 hover:border-purple-600 transition-all"
            >
              <Link href="/tools" className="flex items-center gap-2">
                View All {totalTools}+ Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-blue-100 text-blue-700 border-blue-200">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We've built the fastest, most reliable platform for accessing premium AI tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Delivery",
                description: "Get access within 10 seconds after payment. No waiting, no delays.",
                stat: "10s",
                statLabel: "Average delivery",
                gradient: "from-orange-500 to-amber-500",
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Secure Payments",
                description: "Bank-level encryption. UPI, cards, and net banking supported.",
                stat: "100%",
                statLabel: "Secure",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "Best Prices",
                description: "Save up to 90% compared to direct subscriptions. No hidden fees.",
                stat: "90%",
                statLabel: "Savings",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <Headphones className="h-8 w-8" />,
                title: "24/7 Support",
                description: "Get help anytime via WhatsApp or email. We're always here for you.",
                stat: "24/7",
                statLabel: "Available",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-2 border-slate-200 hover:border-purple-300 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardHeader className="pb-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-3 text-slate-900">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 border-t border-slate-200">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-1`}>
                      {feature.stat}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">{feature.statLabel}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-indigo-100 text-indigo-700 border-indigo-200">
              Simple Process
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-slate-600">
              From signup to instant access in under 2 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Browse Tools",
                description: "Explore our catalog of {totalTools}+ premium AI tools and services.",
                icon: <Sparkles className="h-6 w-6" />,
              },
              {
                step: "02",
                title: "Select Plan",
                description: "Choose between Shared or Private plans based on your needs.",
                icon: <CheckCircle2 className="h-6 w-6" />,
              },
              {
                step: "03",
                title: "Secure Payment",
                description: "Pay securely via UPI, cards, or net banking. Instant confirmation.",
                icon: <Lock className="h-6 w-6" />,
              },
              {
                step: "04",
                title: "Instant Access",
                description: "Get immediate access to your premium tools. Start creating!",
                icon: <Rocket className="h-6 w-6" />,
              },
            ].map((step, index) => (
              <div 
                key={index} 
                className="relative text-center group"
              >
                <div className="relative mb-6">
                  <div className="text-7xl font-extrabold text-slate-100 group-hover:text-purple-100 transition-colors">
                    {step.step}
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-200 to-blue-200" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button 
              asChild 
              size="lg"
              className="px-8 py-6 h-auto text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/register" className="flex items-center gap-2">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-green-100 text-green-700 border-green-200">
              Trusted by Thousands
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900">
              Loved by {totalUsers.toLocaleString()}+ Users
            </h2>
            <p className="text-xl text-slate-600">
              Join thousands of satisfied customers transforming their workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Rahul Sharma",
                role: "Content Creator",
                tool: "ChatGPT Pro",
                review: "Saved ₹20,000/month on AI tools! Instant access and flawless service. Best investment for my business.",
                rating: 5,
              },
              {
                name: "Priya Patel",
                role: "Digital Marketer",
                tool: "Grammarly + Canva",
                review: "Reliable source for premium tools at unbeatable prices. Customer support is amazing!",
                rating: 5,
              },
              {
                name: "Amit Kumar",
                role: "SEO Specialist",
                tool: "Semrush",
                review: "Helped me grow my agency. Instant activation, no waiting. 10/10 would recommend!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-2 border-slate-200 hover:border-purple-300 bg-white hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-900">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">{testimonial.tool}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{testimonial.review}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '4.9/5', label: 'Average Rating', icon: Star },
              { value: `${totalUsers.toLocaleString()}+`, label: 'Happy Users', icon: Users },
              { value: '99%', label: 'Satisfaction', icon: TrendingUp },
              { value: '24/7', label: 'Support', icon: Headphones },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="text-center p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
              >
                <stat.icon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join {totalUsers.toLocaleString()}+ users saving money and boosting productivity with premium AI tools
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {['Instant activation', '24/7 support', 'Secure payments', 'No hidden fees'].map((text, idx) => (
              <Badge 
                key={idx}
                className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {text}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-6 h-auto bg-white text-purple-600 hover:bg-slate-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/tools" className="flex items-center gap-2">
                Browse All Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              <Link href="/tools">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">GrowTools</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Premium AI tools at unbeatable prices. Trusted by thousands of users across India.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/tools" className="hover:text-white transition">Tools</Link></li>
                <li><Link href="/tools" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
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
            <p>&copy; {new Date().getFullYear()} GrowTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
