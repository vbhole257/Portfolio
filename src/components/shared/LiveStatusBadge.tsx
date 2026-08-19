'use client';

import React, { useState, useEffect } from 'react';
import { useSound } from '@/components/providers/SoundProvider';

interface LiveStatusBadgeProps {
  compact?: boolean;
  className?: string;
}

export default function LiveStatusBadge({ compact = false, className = '' }: LiveStatusBadgeProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const { playHoverSound } = useSound();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div
        onMouseEnter={playHoverSound}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold tracking-wide transition-all ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Open to Roles</span>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={playHoverSound}
      className={`inline-flex flex-wrap items-center gap-3 px-3.5 py-1.5 rounded-full bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 text-charcoal dark:text-cream text-xs font-mono transition-all ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          Open for Full-Time Roles
        </span>
      </div>

      <div className="h-3 w-px bg-charcoal/15 dark:bg-white/15 hidden sm:block" />

      <div className="text-gray-soft dark:text-cream/70 text-[11px] font-mono flex items-center gap-1.5">
        <span>📍 India (IST)</span>
        {timeStr && <span className="font-semibold text-accent dark:text-accent-light">[{timeStr}]</span>}
      </div>
    </div>
  );
}
