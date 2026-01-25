'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Star, ShoppingCart, Eye } from "lucide-react";
import { ToolIcon } from "./tool-icon";

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
    sharedPlanPrice?: number | null;
    privatePlanPrice?: number | null;
    sharedPlanEnabled?: boolean;
    privatePlanEnabled?: boolean;
    isActive: boolean;
  };
  showSubscribeButton?: boolean;
}

export function ToolCard({ tool, showSubscribeButton = true }: ToolCardProps) {
  const router = useRouter();
  const categoryLabels: Record<string, string> = {
    AI_WRITING: "AI Writing",
    SEO_TOOLS: "SEO & Marketing",
    DESIGN: "Design",
    PRODUCTIVITY: "Productivity",
    CODE_DEV: "Code & Dev",
    VIDEO_AUDIO: "Video & Audio",
    OTHER: "Other",
  };

  // Determine the price to display
  // Priority: sharedPlanPrice > privatePlanPrice > priceMonthly
  // If both plans are enabled, show the lower price
  const getDisplayPrice = () => {
    const sharedPrice = tool.sharedPlanPrice;
    const privatePrice = tool.privatePlanPrice;
    const fallbackPrice = tool.priceMonthly;

    // If both plans are enabled, show the lower price
    if (tool.sharedPlanEnabled && tool.privatePlanEnabled) {
      if (sharedPrice && privatePrice) {
        return Math.min(sharedPrice, privatePrice);
      }
      if (sharedPrice) return sharedPrice;
      if (privatePrice) return privatePrice;
      return fallbackPrice;
    }

    // If only shared plan is enabled
    if (tool.sharedPlanEnabled && sharedPrice) {
      return sharedPrice;
    }

    // If only private plan is enabled
    if (tool.privatePlanEnabled && privatePrice) {
      return privatePrice;
    }

    // Fallback to priceMonthly
    return fallbackPrice;
  };

  const displayPrice = getDisplayPrice();
  
  // Calculate discount if we have both shared and private prices
  let originalPrice: number | null = null;
  let discountPercent: number | null = null;
  
  if (tool.sharedPlanEnabled && tool.privatePlanEnabled && tool.sharedPlanPrice && tool.privatePlanPrice) {
    const higherPrice = Math.max(tool.sharedPlanPrice, tool.privatePlanPrice);
    const lowerPrice = Math.min(tool.sharedPlanPrice, tool.privatePlanPrice);
    if (higherPrice > lowerPrice) {
      originalPrice = higherPrice;
      discountPercent = Math.round(((higherPrice - lowerPrice) / higherPrice) * 100);
    }
  }

  // Generate features from description
  const getFeatures = () => {
    const desc = tool.shortDescription || tool.description || "";
    const features = desc.split(/[.,;]/).filter(f => f.trim().length > 10).slice(0, 3);
    return features.length > 0 ? features : ['Premium features', 'Full access', 'Monthly updates'];
  };

  const features = getFeatures();

  const handleCardClick = () => {
    router.push(`/checkout/${tool.id}`);
  };

  return (
    <Card 
      className="group relative overflow-hidden glass border border-slate-200 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none" />
      
      <CardHeader className="flex-1 pb-4">
        {/* Tool Icon/Logo */}
        <div className="flex items-center justify-between mb-3">
          <div className="group-hover:scale-110 transition-transform duration-300">
            <ToolIcon icon={tool.icon} name={tool.name} size="lg" />
          </div>
          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>4.9</span>
          </div>
        </div>

        {/* Category Badge */}
        <Badge 
          className="glass border-slate-200 text-slate-700 text-xs font-medium mb-3 w-fit"
          variant="secondary"
        >
          {categoryLabels[tool.category] || tool.category}
        </Badge>

        {/* Tool Name */}
        <CardTitle className="text-lg font-bold mb-2 text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
          {tool.name}
        </CardTitle>

        {/* Description */}
        <CardDescription className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors line-clamp-2 mb-4">
          {tool.shortDescription || tool.description || "Premium AI tool access"}
        </CardDescription>

        {/* Features List */}
        <div className="space-y-1 mb-4">
          {features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span className="line-clamp-1">{feature.trim()}</span>
            </div>
          ))}
          {features.length > 3 && (
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span>+{features.length - 3} more</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2 flex-wrap">
            <div className="text-2xl font-bold gradient-text">
              {formatPrice(displayPrice)}
            </div>
            {originalPrice && discountPercent && (
              <>
                <div className="text-sm text-slate-500 line-through">
                  {formatPrice(originalPrice)}
                </div>
                <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">
                  {discountPercent}% OFF
                </Badge>
              </>
            )}
          </div>
          <div className="text-xs text-slate-500">
            {tool.sharedPlanEnabled && tool.privatePlanEnabled 
              ? 'Starting from' 
              : tool.sharedPlanEnabled 
                ? 'Shared plan' 
                : tool.privatePlanEnabled 
                  ? 'Private plan' 
                  : ''} per month
          </div>
          {tool.sharedPlanEnabled && tool.privatePlanEnabled && (
            <div className="flex gap-2 text-xs">
              {tool.sharedPlanPrice && (
                <Badge variant="outline" className="text-xs">
                  Shared: {formatPrice(tool.sharedPlanPrice)}
                </Badge>
              )}
              {tool.privatePlanPrice && (
                <Badge variant="outline" className="text-xs">
                  Private: {formatPrice(tool.privatePlanPrice)}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          {showSubscribeButton && tool.isActive ? (
            <>
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/checkout/${tool.id}`);
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 text-xs"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/checkout/${tool.id}`);
                }}
                className="glass border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-xs"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </>
          ) : !tool.isActive ? (
            <Badge variant="destructive" className="w-full glass border-red-300 bg-red-100 text-red-700 justify-center">
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
