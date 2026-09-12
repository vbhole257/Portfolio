'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useSound } from '@/components/providers/SoundProvider';
import { safeSessionStorage } from '@/utils/storage';
import { FiCoffee, FiX, FiZap } from 'react-icons/fi';

interface BuyCoffeeToastProps {
  onOpenCoffeeModal: () => void;
}

export default function BuyCoffeeToast({ onOpenCoffeeModal }: BuyCoffeeToastProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const flashBeamRef = useRef<HTMLDivElement>(null);
  const { playClickSound, playHoverSound, playSuccessSound } = useSound();

  useEffect(() => {
    setIsMounted(true);

    // Check if user has already seen or dismissed the toast in this session
    const hasSeen = safeSessionStorage.getItem('coffee_toast_seen');
    if (hasSeen) return;

    let timer: NodeJS.Timeout;

    // Trigger after preloader completes or after 2.8 seconds
    const showToast = () => {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 2800);
    };

    const hasPreloaderShown = safeSessionStorage.getItem('preloader-shown');
    if (hasPreloaderShown) {
      showToast();
    } else {
      const handler = () => showToast();
      window.addEventListener('preloaderComplete', handler);
      return () => {
        window.removeEventListener('preloaderComplete', handler);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  // Flash animation effect when entering the center of the screen
  useEffect(() => {
    if (!isVisible || !toastRef.current) return;

    const el = toastRef.current;
    const beam = flashBeamRef.current;

    // Fast initial sound
    playSuccessSound();

    // GSAP Flash Entrance Timeline
    const tl = gsap.timeline();

    // Set offscreen to the left with speed skew
    gsap.set(el, {
      x: -window.innerWidth,
      opacity: 0,
      skewX: -18,
      scale: 0.9,
    });

    // Rapid lightning slide into center
    tl.to(el, {
      x: 0,
      opacity: 1,
      skewX: 0,
      scale: 1,
      duration: 0.55,
      ease: 'expo.out',
    });

    // Light flash / beam streak sweep across card
    if (beam) {
      tl.fromTo(
        beam,
        { x: '-120%', opacity: 1 },
        { x: '250%', opacity: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.35'
      );
    }
  }, [isVisible, playSuccessSound]);

  const handleDismiss = () => {
    playClickSound();
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setIsVisible(false);
          safeSessionStorage.setItem('coffee_toast_seen', 'true');
        },
      });
    } else {
      setIsVisible(false);
      safeSessionStorage.setItem('coffee_toast_seen', 'true');
    }
  };

  const handleAction = () => {
    playClickSound();
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        scale: 1.05,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setIsVisible(false);
          safeSessionStorage.setItem('coffee_toast_seen', 'true');
          onOpenCoffeeModal();
        },
      });
    } else {
      setIsVisible(false);
      safeSessionStorage.setItem('coffee_toast_seen', 'true');
      onOpenCoffeeModal();
    }
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div
      ref={toastRef}
      role="dialog"
      aria-label="Buy me a coffee prompt"
      className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[9990] w-[92vw] max-w-lg p-4 sm:p-5 rounded-3xl bg-surface/95 dark:bg-ink/95 backdrop-blur-xl border-2 border-accent shadow-[0_20px_60px_-15px_rgba(196,93,62,0.4)] text-cream overflow-hidden"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Flash Beam Streak Overlay */}
      <div
        ref={flashBeamRef}
        className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] z-20"
        style={{ willChange: 'transform' }}
      />

      <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
        {/* Animated Coffee Badge */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-accent/20 border border-accent/50 flex items-center justify-center text-accent shrink-0 relative">
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </span>
          <FiCoffee className="w-6 h-6 animate-bounce text-accent" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-accent flex items-center gap-1">
              <FiZap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Fuel My Next Build</span>
            </span>
            <span className="text-xs">☕</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-cream/90 font-medium leading-snug">
            Enjoying this portfolio? Support my work with a quick coffee!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAction}
            onMouseEnter={playHoverSound}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-accent text-white font-mono text-xs font-black uppercase tracking-wider hover:bg-accent/90 transition-all shadow-lg shadow-accent/30 hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>Buy Coffee ☕</span>
          </button>

          <button
            onClick={handleDismiss}
            onMouseEnter={playHoverSound}
            className="p-2 rounded-xl text-gray-soft hover:text-cream hover:bg-white/10 transition-colors"
            aria-label="Dismiss coffee prompt"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
