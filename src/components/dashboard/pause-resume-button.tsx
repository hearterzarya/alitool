'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface PauseResumeButtonProps {
  subscriptionId: string;
  status: 'ACTIVE' | 'PAUSED';
  variant?: 'active' | 'paused';
}

export function PauseResumeButton({ subscriptionId, status, variant = 'active' }: PauseResumeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isPaused = status === 'PAUSED';

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscriptions/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error ?? 'Failed to update subscription');
      }
    } catch {
      alert('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  if (isPaused) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
        onClick={handleClick}
        disabled={loading}
      >
        <Play className="h-3.5 w-3.5 mr-1.5" />
        {loading ? 'Resuming...' : 'Resume'}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
      onClick={handleClick}
      disabled={loading}
    >
      <Pause className="h-3.5 w-3.5 mr-1.5" />
      {loading ? 'Pausing...' : 'Pause'}
    </Button>
  );
}
