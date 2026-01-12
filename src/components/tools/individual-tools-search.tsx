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
      
      // Search in plan features
      const sharedFeatures = tool.sharedPlanFeatures?.toLowerCase() || '';
      const privateFeatures = tool.privatePlanFeatures?.toLowerCase() || '';
      const featuresMatch = sharedFeatures.includes(query) || privateFeatures.includes(query);

      return nameMatch || descriptionMatch || featuresMatch;
    });
  }, [searchQuery, initialTools]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tools, plans, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-6 text-lg border-2 border-slate-300 focus:border-purple-500 rounded-xl"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-slate-600 mt-2 text-center">
            Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          </p>
        )}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {filteredTools.map((tool) => (
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600">
            {searchQuery ? `No tools found matching "${searchQuery}"` : 'Tools will be available soon. Check back later!'}
          </p>
        </div>
      )}
    </div>
  );
}
