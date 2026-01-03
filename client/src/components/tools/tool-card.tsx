'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

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
  const categoryColors: Record<string, string> = {
    AI_WRITING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    SEO_TOOLS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    DESIGN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    PRODUCTIVITY: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    CODE_DEV: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    VIDEO_AUDIO: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  const categoryLabels: Record<string, string> = {
    AI_WRITING: "AI Writing",
    SEO_TOOLS: "SEO Tools",
    DESIGN: "Design",
    PRODUCTIVITY: "Productivity",
    CODE_DEV: "Code & Dev",
    VIDEO_AUDIO: "Video & Audio",
    OTHER: "Other",
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-2">
          <Badge className={categoryColors[tool.category] || categoryColors.OTHER} variant="secondary">
            {categoryLabels[tool.category] || tool.category}
          </Badge>
        </div>

        {/* Icon */}
        <div className="text-5xl mb-3">{tool.icon || "🛠️"}</div>

        {/* Tool Name */}
        <CardTitle className="text-xl mb-2">{tool.name}</CardTitle>

        {/* Description */}
        <CardDescription className="line-clamp-2">
          {tool.shortDescription || tool.description || "Premium AI tool access"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          {/* Price */}
          <div>
            <div className="text-3xl font-bold text-primary">
              {formatPrice(tool.priceMonthly)}
            </div>
            <div className="text-sm text-muted-foreground">per month</div>
          </div>

          {/* Subscribe Button */}
          {showSubscribeButton && tool.isActive && (
            <Button asChild>
              <Link href={`/checkout/${tool.id}`}>
                Subscribe
              </Link>
            </Button>
          )}

          {!tool.isActive && (
            <Badge variant="destructive">Unavailable</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
