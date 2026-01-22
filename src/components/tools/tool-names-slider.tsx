'use client';

import { useEffect, useState } from 'react';

interface ToolNamesSliderProps {
  tools: Array<{ name: string; id: string }>;
}

export function ToolNamesSlider({ tools }: ToolNamesSliderProps) {
  const [toolNames, setToolNames] = useState<string[]>([]);

  useEffect(() => {
    // Extract tool names and duplicate for infinite scroll
    const names = tools.map(t => t.name);
    // Duplicate the array multiple times for seamless infinite scroll
    setToolNames([...names, ...names, ...names]);
  }, [tools]);

  if (toolNames.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 py-3 sm:py-4 md:py-6">
      <div className="relative w-full">
        <div className="flex animate-scroll-infinite whitespace-nowrap">
          {toolNames.map((name, index) => (
            <div
              key={`${name}-${index}`}
              className="inline-flex items-center mx-3 sm:mx-4 md:mx-6 lg:mx-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-700 hover:text-purple-600 transition-colors duration-300"
            >
              {name}
              <span className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 text-purple-400">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
