import { prisma } from "@/lib/prisma";
import { ToolCard } from "@/components/tools/tool-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const searchQuery = params.search;

  // Fetch all tools from database
  const tools = await prisma.tool.findMany({
    where: {
      isActive: true,
      ...(selectedCategory && { category: selectedCategory }),
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

  // Get unique categories for filtering
  const categories = [
    { value: 'AI_WRITING', label: 'AI Writing', count: await prisma.tool.count({ where: { category: 'AI_WRITING', isActive: true } }) },
    { value: 'SEO_TOOLS', label: 'SEO Tools', count: await prisma.tool.count({ where: { category: 'SEO_TOOLS', isActive: true } }) },
    { value: 'DESIGN', label: 'Design', count: await prisma.tool.count({ where: { category: 'DESIGN', isActive: true } }) },
    { value: 'PRODUCTIVITY', label: 'Productivity', count: await prisma.tool.count({ where: { category: 'PRODUCTIVITY', isActive: true } }) },
    { value: 'CODE_DEV', label: 'Code & Dev', count: await prisma.tool.count({ where: { category: 'CODE_DEV', isActive: true } }) },
    { value: 'VIDEO_AUDIO', label: 'Video & Audio', count: await prisma.tool.count({ where: { category: 'VIDEO_AUDIO', isActive: true } }) },
    { value: 'OTHER', label: 'Other', count: await prisma.tool.count({ where: { category: 'OTHER', isActive: true } }) },
  ].filter(cat => cat.count > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Browse Premium AI Tools</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Subscribe to individual tools or get multiple tools for maximum productivity.
            All tools come with instant access and monthly billing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 sticky top-4">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search Tools</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-10"
                    defaultValue={searchQuery}
                    name="search"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Categories</label>
                <div className="space-y-2">
                  <Link
                    href="/tools"
                    className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-sm">All Tools</span>
                    <Badge variant="secondary">{tools.length}</Badge>
                  </Link>

                  {categories.map((category) => (
                    <Link
                      key={category.value}
                      href={`/tools?category=${category.value}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-sm">{category.label}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Pricing</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  All tools have monthly subscriptions. No hidden fees. Cancel anytime.
                </p>
              </div>
            </div>
          </aside>

          {/* Tools Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory
                    ? categories.find(c => c.value === selectedCategory)?.label || 'Tools'
                    : 'All Tools'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {tools.length} {tools.length === 1 ? 'tool' : 'tools'} available
                </p>
              </div>
            </div>

            {/* Tools Grid */}
            {tools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Link
                  href="/tools"
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
