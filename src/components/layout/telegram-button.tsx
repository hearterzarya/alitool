'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function TelegramButton() {
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/config/telegram')
      .then((res) => res.ok ? res.json() : { link: null })
      .then((data: { link: string | null }) => {
        const raw = data?.link;
        const url = typeof raw === 'string' && raw.trim() ? raw.trim() : null;
        setLink(url);
      })
      .catch(() => setLink(null));
  }, []);

  if (!link) return null;

  const href = link.startsWith('http') ? link : `https://t.me/${link.replace(/^@/, '')}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-24 z-50 flex items-center justify-center w-14 h-14 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Join us on Telegram"
    >
      <Image src="/telegram-icon.svg" alt="" width={28} height={28} className="w-7 h-7 object-contain" unoptimized />
      <span className="absolute -top-12 right-0 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Telegram
      </span>
    </a>
  );
}
