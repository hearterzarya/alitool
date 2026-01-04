'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Star, ShoppingCart, Eye } from "lucide-react";

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    category: string;
    icon?: string;
    priceMonthly: number;
    isActive: boolean;
  };
  showSubscribeButton?: boolean;
}

export function ToolCard({ tool, showSubscribeButton = true }: ToolCardProps) {
  const categoryLabels: Record<string, string> = {
    AI_WRITING: "AI Writing",
    SEO_TOOLS: "SEO & Marketing",
    DESIGN: "Design",
    PRODUCTIVITY: "Productivity",
    CODE_DEV: "Code & Dev",
    VIDEO_AUDIO: "Video & Audio",
    OTHER: "Other",
  };

  // Calculate discount (assuming 75% off for demo)
  const originalPrice = tool.priceMonthly * 4; // 4x for 75% discount
  const discountPercent = 75;
  const currentPrice = tool.priceMonthly;

  // Generate features from description
  const getFeatures = () => {
    const desc = tool.shortDescription || tool.description || "";
    const features = desc.split(/[.,;]/).filter(f => f.trim().length > 10).slice(0, 3);
    return features.length > 0 ? features : ['Premium features', 'Full access', 'Monthly updates'];
  };

  const features = getFeatures();

  return (
    <Card className="group relative overflow-hidden glass border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none" />
      
      <CardHeader className="flex-1 pb-4">
        {/* Tool Icon/Logo */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {tool.icon || "🛠️"}
          </div>
          <div className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
            <Star className="h-3 w-3 fill-yellow-400" />
            <span>4.9</span>
          </div>
        </div>

        {/* Category Badge */}
        <Badge 
          className="glass border-white/10 text-gray-300 text-xs font-medium mb-3 w-fit"
          variant="secondary"
        >
          {categoryLabels[tool.category] || tool.category}
        </Badge>

        {/* Tool Name */}
        <CardTitle className="text-lg font-bold mb-2 text-white group-hover:text-purple-300 transition-colors line-clamp-1">
          {tool.name}
        </CardTitle>

        {/* Description */}
        <CardDescription className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-2 mb-4">
          {tool.shortDescription || tool.description || "Premium AI tool access"}
        </CardDescription>

        {/* Features List */}
        <div className="space-y-1 mb-4">
          {features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span className="line-clamp-1">{feature.trim()}</span>
            </div>
          ))}
          {features.length > 3 && (
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span>+{features.length - 3} more</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Pricing */}
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold gradient-text">
            ${(currentPrice / 100).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 line-through">
            ${(originalPrice / 100).toFixed(2)}
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
            {discountPercent}% OFF
          </Badge>
        </div>
        <div className="text-xs text-gray-500">per month</div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {showSubscribeButton && tool.isActive ? (
            <>
              <Button 
                asChild
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 text-xs"
              >
                <Link href={`/checkout/${tool.id}`} className="flex items-center justify-center">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </Link>
              </Button>
              <Button 
                asChild
                size="sm"
                variant="outline"
                className="glass border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all text-xs"
              >
                <Link href={`/checkout/${tool.id}`} className="flex items-center justify-center">
                  <Eye className="h-3 w-3" />
                </Link>
              </Button>
            </>
          ) : !tool.isActive ? (
            <Badge variant="destructive" className="w-full glass border-red-500/50 bg-red-500/20 text-red-300 justify-center">
              Unavailable
            </Badge>
          ) : null}
        </div>
      </CardContent>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </Card>
  );
}
