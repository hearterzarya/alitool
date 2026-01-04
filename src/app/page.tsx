import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, CheckCircle2, Clock, DollarSign, Headphones, CheckCircle, MessageCircle, Users, Zap, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

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

  // Floating tool icons for hero section
  const floatingIcons = [
    { icon: '🤖', delay: '0s', position: 'top-20 left-10' },
    { icon: '🧠', delay: '1s', position: 'top-40 right-20' },
    { icon: '✍️', delay: '2s', position: 'bottom-40 left-20' },
    { icon: '🎨', delay: '0.5s', position: 'top-60 right-40' },
    { icon: '🖼️', delay: '1.5s', position: 'bottom-60 left-40' },
    { icon: '📊', delay: '2.5s', position: 'top-80 right-60' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg pt-32 pb-20 sm:pt-40 sm:pb-32">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 via-blue-100/30 to-slate-100/30 animate-gradient" />
        
        {/* Floating Tool Icons */}
        {floatingIcons.map((item, idx) => (
          <div
            key={idx}
            className={`absolute ${item.position} hidden lg:block opacity-20 text-6xl animate-float`}
            style={{ animationDelay: item.delay }}
          >
            {item.icon}
          </div>
        ))}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-slate-300/[0.03] bg-[size:75px_75px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full px-4 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 text-purple-700 text-sm font-medium mb-8 animate-fade-in-up">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
              India's #1 Premium Tools Provider
              <span className="ml-2 text-green-600">Verified</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Premium AI Tools at
              <br />
              <span className="gradient-text animate-gradient">Unbeatable Prices</span>
            </h1>
            
            {/* Subheading */}
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 mb-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Get instant access to ChatGPT Pro, Grammarly, Canva Pro, and {totalTools}+ premium tools. 
              Secure payments, 10-second delivery, 24/7 support.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                asChild 
                size="lg" 
                className="text-base px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-slate-900 border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <Link href="/tools">
                  Browse Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-base px-8 bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
              >
                <Link href="/tools">View Pricing</Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              {[
                { value: `${totalUsers.toLocaleString()}+`, label: 'Happy Users', icon: Users, color: 'text-blue-400' },
                { value: '100%', label: 'Secure', icon: Shield, color: 'text-green-400' },
                { value: '10s', label: 'Instant Delivery', icon: Zap, color: 'text-orange-400' },
                { value: '4.9/5', label: 'User Rating', icon: Star, color: 'text-pink-400' },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="glass rounded-xl p-4 hover:bg-slate-50 transition-all duration-300 hover:scale-105 hover-glow"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-600">{stat.label}</div>
              </div>
              ))}
              </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center mt-12 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              {['Secure UPI Payments', 'Instant Activation', '24/7 WhatsApp Support', `${totalTools}+ Premium Tools`].map((text, idx) => (
                <Badge 
                  key={idx}
                  variant="secondary" 
                  className="px-4 py-2 text-sm glass border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                >
                  {text}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Access Premium AI Tools & Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get instant access to all these powerful tools and many more at unbeatable prices
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {tools.map((tool, idx) => (
              <Link
                key={tool.id}
                href={`/tools#${tool.slug}`}
                className="group flex flex-col items-center justify-center p-6 rounded-xl glass border border-slate-200 hover:border-purple-500/50 hover:bg-purple-50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{tool.icon || "🛠️"}</div>
                <div className="text-sm font-medium text-center text-slate-700 group-hover:text-purple-400 transition-colors">
                  {tool.name}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center animate-fade-in-up">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="bg-white border-2 border-purple-500 text-purple-700 hover:bg-purple-50 hover:border-purple-600 transition-all"
            >
              <Link href="/tools">
                View All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Why Choose Us?</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Experience the fastest and most reliable way to access premium AI tools. 
              From instant delivery to secure accounts, we've got you covered.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            {[
              { value: `${totalUsers.toLocaleString()}+`, label: 'Happy Users' },
              { value: `${totalTools}+`, label: 'Premium Tools' },
              { value: '99.8%', label: 'Uptime' },
              { value: '10s', label: 'Avg. Delivery' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="text-center glass rounded-xl p-4 hover:bg-slate-50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Instant Delivery",
                description: "Get your premium tool access within 10 seconds after payment. No waiting, no delays.",
                stat: "10s",
                statLabel: "Average delivery time",
                color: "text-orange-400",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure Payments",
                description: "Pay securely with UPI, cards, or net banking. Your transactions are encrypted and protected.",
                stat: "100%",
                statLabel: "Secure transactions",
                color: "text-green-400",
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                title: "Affordable Pricing",
                description: "Premium tools at a fraction of the original cost. Save up to 90% on subscriptions.",
                stat: "90%",
                statLabel: "Savings",
                color: "text-blue-400",
              },
              {
                icon: <Headphones className="h-8 w-8" />,
                title: "24/7 Support",
                description: "Get help anytime via WhatsApp or email. Our support team is always ready to assist you.",
                stat: "24/7",
                statLabel: "Support availability",
                color: "text-purple-400",
              },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="glass border-slate-200 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2 text-slate-900">{feature.title}</CardTitle>
                  <CardDescription className="text-sm mb-4 text-slate-600">
                    {feature.description}
                  </CardDescription>
                  <div className="pt-4 border-t border-slate-200">
                    <div className={`text-2xl font-bold ${feature.color} mb-1`}>{feature.stat}</div>
                    <div className="text-xs text-gray-500">{feature.statLabel}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm" className="w-full text-slate-700 hover:text-slate-900 hover:bg-slate-50">
                    <Link href="/tools">Learn more</Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-slate-900 border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Link href="/tools">Start Exploring</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Process Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Get Started in 4 Easy Steps</h2>
            <p className="text-lg text-slate-600">
              From signup to instant access in under 2 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up for free in seconds. No credit card required.",
              },
              {
                step: "02",
                title: "Choose Tools",
                description: "Browse our catalog and add tools to your cart.",
              },
              {
                step: "03",
                title: "Secure Payment",
                description: "Pay securely via UPI, cards, or crypto.",
              },
              {
                step: "04",
                title: "Instant Access",
                description: "Get immediate access to your premium tools.",
              },
            ].map((step, index) => (
              <div 
                key={index} 
                className="text-center glass rounded-xl p-6 hover:bg-slate-50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-6xl font-bold gradient-text mb-4 opacity-30">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-slate-900 border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Link href="/register">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Loved by {totalUsers.toLocaleString()}+ Users</h2>
            <p className="text-lg text-slate-600">
              Join thousands of satisfied customers who transformed their workflow with GrowTools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: "Rahul Sharma",
                role: "Content Creator",
                tool: "ChatGPT Pro",
                initials: "RS",
                review: "GrowTools saved me ₹20,000/month on AI tools! ChatGPT Pro access is instant and works flawlessly. Best investment for my content business.",
              },
              {
                name: "Priya Patel",
                role: "Digital Marketer",
                tool: "Grammarly + Canva",
                initials: "PP",
                review: "Finally found a reliable source for premium tools. Grammarly Pro and Canva Pro at unbeatable prices. Customer support is amazing!",
              },
              {
                name: "Amit Kumar",
                role: "SEO Specialist",
                tool: "Semrush",
                initials: "AK",
                review: "Semrush access helped me grow my agency. Instant activation, no waiting. 10/10 would recommend to all digital marketers.",
              },
              {
                name: "Sneha Gupta",
                role: "Student",
                tool: "QuillBot + Claude",
                initials: "SG",
                review: "As a student, I couldn't afford these tools. GrowTools made premium AI accessible to me. My academic work improved significantly!",
              },
              {
                name: "Vikram Singh",
                role: "Freelancer",
                tool: "Multiple Tools",
                initials: "VS",
                review: "I was skeptical at first, but the 10-second delivery is real! Been using their services for 6 months now. Absolutely reliable.",
              },
              {
                name: "Ananya Reddy",
                role: "YouTuber",
                tool: "Leonardo AI + Canva",
                initials: "AR",
                review: "Leonardo AI and Canva Pro bundle helped me 10x my thumbnail game. My CTR increased by 40%! Worth every rupee.",
              },
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="glass border-slate-200 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-purple-300 font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-900">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm text-slate-600">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit glass border-slate-200 text-slate-700">{testimonial.tool}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 italic">
                    "{testimonial.review}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonial Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { value: '4.9/5', label: 'Average Rating' },
              { value: `${totalUsers.toLocaleString()}+`, label: 'Happy Users' },
              { value: '99%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="glass rounded-xl p-4 hover:bg-slate-50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-100 via-blue-100 to-slate-100 text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 to-blue-200/30 animate-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 animate-fade-in-up">Ready to Supercharge Your Workflow?</h2>
          <p className="text-lg mb-8 text-slate-700 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join {totalUsers.toLocaleString()}+ users who are saving money and boosting productivity with premium AI tools at unbeatable prices.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {['Instant tool activation', '24/7 WhatsApp support', 'Secure UPI payments', 'No hidden charges'].map((text, idx) => (
              <Badge 
                key={idx}
                variant="secondary" 
                className="px-4 py-2 text-sm bg-white text-slate-900 border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                {text}
              </Badge>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              asChild 
              size="lg" 
              className="text-base px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <Link href="/tools">Browse Tools</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-base px-8 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 hover:border-slate-400 transition-all duration-300"
            >
              <Link href="/tools">View Pricing</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-slate-600 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            Trusted by students, freelancers, and businesses across India
          </p>
        </div>
      </section>

      {/* Chat Icon - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <button className="group relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-slate-900 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 animate-pulse-glow">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-slate-900">
            AI
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white text-slate-700 py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-slate-900 font-bold text-lg mb-4">GrowTools</h3>
              <p className="text-sm text-slate-600">
                Access premium AI tools with affordable monthly subscriptions.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools" className="hover:text-slate-900 transition">Tools</Link></li>
                <li><Link href="/tools" className="hover:text-slate-900 transition">Pricing</Link></li>
                <li><Link href="#features" className="hover:text-slate-900 transition">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-slate-900 transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 transition">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-slate-900 transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-slate-900 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900 transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2026 GrowTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
