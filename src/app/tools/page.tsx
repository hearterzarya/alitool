import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { ToolCategory } from "@prisma/client";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

const VALID_CATEGORIES: ToolCategory[] = [
  'AI_WRITING',
  'SEO_TOOLS',
  'DESIGN',
  'PRODUCTIVITY',
  'CODE_DEV',
  'VIDEO_AUDIO',
  'OTHER',
];

export default async function ToolsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const searchQuery = params.search;

  // Validate category
  const validCategory = selectedCategory && VALID_CATEGORIES.includes(selectedCategory as ToolCategory)
    ? (selectedCategory as ToolCategory)
    : undefined;

  // Fetch all tools from database
  let allTools: any[] = [];
  let categories: Array<{ value: string; label: string; count: number }> = [];
  let totalCount = 0;

  try {
    allTools = await prisma.tool.findMany({
      where: {
        isActive: true,
        ...(validCategory && { category: validCategory }),
        ...(searchQuery && {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    totalCount = await prisma.tool.count({ where: { isActive: true } });

    // Get unique categories for filtering
    categories = [
      { 
        value: 'AI_WRITING', 
        label: 'AI Writing', 
        count: await prisma.tool.count({ where: { category: 'AI_WRITING', isActive: true } }) 
      },
      { 
        value: 'SEO_TOOLS', 
        label: 'SEO & Marketing', 
        count: await prisma.tool.count({ where: { category: 'SEO_TOOLS', isActive: true } }) 
      },
      { 
        value: 'DESIGN', 
        label: 'Design', 
        count: await prisma.tool.count({ where: { category: 'DESIGN', isActive: true } }) 
      },
      { 
        value: 'PRODUCTIVITY', 
        label: 'Productivity', 
        count: await prisma.tool.count({ where: { category: 'PRODUCTIVITY', isActive: true } }) 
      },
      { 
        value: 'CODE_DEV', 
        label: 'Code & Dev', 
        count: await prisma.tool.count({ where: { category: 'CODE_DEV', isActive: true } }) 
      },
      { 
        value: 'VIDEO_AUDIO', 
        label: 'Video & Audio', 
        count: await prisma.tool.count({ where: { category: 'VIDEO_AUDIO', isActive: true } }) 
      },
      { 
        value: 'OTHER', 
        label: 'Other', 
        count: await prisma.tool.count({ where: { category: 'OTHER', isActive: true } }) 
      },
    ].filter(cat => cat.count > 0);

    // Featured tool (first tool or ChatGPT if available)
    const featuredTool = allTools.find(t => t.name.toLowerCase().includes('chatgpt')) || allTools[0];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-16">
        {/* Header */}
        <section className="relative overflow-hidden gradient-bg py-12 sm:py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-slate-900/20 animate-gradient" />
          <div className="absolute inset-0 bg-grid-slate-400/[0.02] bg-[size:75px_75px]" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
                Premium <span className="gradient-text">Tools</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Access the best productivity, entertainment, and AI tools with our curated selection
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Tool */}
          {featuredTool && !validCategory && !searchQuery && (
            <div className="mb-12 animate-fade-in-up">
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 text-purple-300">
                  Featured
                </Badge>
                <Badge className="glass border-white/10 text-gray-300">
                  {categories.find(c => c.value === featuredTool.category)?.label || 'AI Assistant'}
                </Badge>
              </div>
              <div className="glass rounded-xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="text-7xl mb-4">{featuredTool.icon || "🛠️"}</div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{featuredTool.name}</h2>
                    <p className="text-gray-300 mb-6 text-lg">
                      {featuredTool.shortDescription || featuredTool.description || "Premium AI tool access"}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['GPT-4 Access', 'Unlimited conversations', 'Priority access', 'Advanced reasoning'].slice(0, 4).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="glass border-white/10 text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div>
                        <div className="text-3xl font-bold gradient-text">
                          ${(featuredTool.priceMonthly / 100).toFixed(2)}/month
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Link
                        href={`/checkout/${featuredTool.id}`}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                      >
                        Add to Cart
                      </Link>
                      <Link
                        href={`/checkout/${featuredTool.id}`}
                        className="px-6 py-3 rounded-lg glass border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-end">
                    <div className="text-9xl opacity-20">{featuredTool.icon || "🛠️"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Sections */}
          {!searchQuery && (
            <>
              {categories.map((category, catIdx) => {
                const categoryTools = allTools.filter(tool => tool.category === category.value);
                if (categoryTools.length === 0) return null;

                return (
                  <div key={category.value} className="mb-12 animate-fade-in-up" style={{ animationDelay: `${catIdx * 0.1}s` }}>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          {category.label}
                        </h2>
                        <Badge variant="secondary" className="glass border-white/10 text-gray-300">
                          {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'}
                        </Badge>
                      </div>
                      {categoryTools.length > 3 && (
                        <Link
                          href={`/tools?category=${category.value}`}
                          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <span>View All</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryTools.slice(0, validCategory === category.value ? undefined : 4).map((tool, idx) => (
                        <div
                          key={tool.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <ToolCard tool={tool} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Search Results or Filtered Results */}
          {(searchQuery || validCategory) && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {validCategory
                      ? categories.find(c => c.value === validCategory)?.label || 'Tools'
                      : 'Search Results'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {allTools.length} {allTools.length === 1 ? 'tool' : 'tools'} found
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
                {(searchQuery || validCategory) && (
                  <Link
                    href="/tools"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Clear filters
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allTools.map((tool, idx) => (
                  <div
                    key={tool.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('Database error:', error?.message);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-16 flex items-center justify-center">
        <div className="text-center glass rounded-xl p-8 border border-white/10">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2 text-white">Error loading tools</h3>
          <p className="text-gray-400 mb-4">
            Please try again later or contact support
          </p>
        </div>
      </div>
    );
  }
}
