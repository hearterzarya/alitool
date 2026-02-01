'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ToolIcon } from '@/components/tools/tool-icon';

interface Tool {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description?: string;
  sharedPlanFeatures?: string | null;
  privatePlanFeatures?: string | null;
}

interface IndividualToolsSearchProps {
  tools: Tool[];
}

export function IndividualToolsSearch({ tools: initialTools }: IndividualToolsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialTools;
    }

    const query = searchQuery.toLowerCase();
    return initialTools.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(query);
      const descriptionMatch = tool.description?.toLowerCase().includes(query);
      const sharedFeatures = tool.sharedPlanFeatures?.toLowerCase() || '';
      const privateFeatures = tool.privatePlanFeatures?.toLowerCase() || '';
      const featuresMatch = sharedFeatures.includes(query) || privateFeatures.includes(query);
      return nameMatch || descriptionMatch || featuresMatch;
    });
  }, [searchQuery, initialTools]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors pointer-events-none" />
          <Input
            type="text"
            placeholder="Search tools, plans, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-slate-500 mt-2 text-center">
            {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
          </p>
        )}
      </div>

      {/* Tools Grid — big images, full view (no crop) */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="w-full aspect-square min-h-[140px] sm:min-h-[160px] rounded-t-xl bg-slate-50 border-b border-slate-200 flex items-center justify-center overflow-hidden p-3 sm:p-4 group-hover:scale-[1.02] transition-transform duration-300">
                <ToolIcon icon={tool.icon} name={tool.name} size="2xl" className="!w-full !h-full !max-w-full !max-h-full !rounded-xl !border-0" />
              </div>
              <div className="p-3 sm:p-4 flex-1 flex items-center justify-center min-h-[3rem]">
                <span className="text-sm font-semibold text-slate-800 text-center line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {tool.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          <p className="text-slate-600">
            {searchQuery ? `No tools found for "${searchQuery}"` : 'Tools will be available soon. Check back later!'}
          </p>
        </div>
      )}
    </div>
  );
}
