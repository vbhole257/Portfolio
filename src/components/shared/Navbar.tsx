'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTransitionState } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import AnimatedLink from '@/components/ui/AnimateLink';
import { useHandleLinkClick } from '@/lib/navigation';
import Lenis from '@studio-freight/lenis';
import { useSound } from '@/components/providers/SoundProvider';
import LiveStatusBadge from '@/components/shared/LiveStatusBadge';
import RecruiterHubModal from '@/components/shared/RecruiterHubModal';
import AiAssistantModal from '@/components/shared/AiAssistantModal';
import BuyMeCoffeeModal from '@/components/shared/BuyMeCoffeeModal';
import BuyCoffeeToast from '@/components/shared/BuyCoffeeToast';
import { FiBriefcase, FiCpu, FiCoffee } from 'react-icons/fi';

interface AnimatedHamburgerProps {
  isOpen: boolean;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({ isOpen }) => {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const hasInitRef = useRef<boolean>(false);

  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!l1 || !l2) return;

    if (!hasInitRef.current) {
      hasInitRef.current = true;
      if (isOpen) {
        gsap.set(l1, { y: 0, rotation: 45 });
        gsap.set(l2, { y: 0, rotation: -45 });
      } else {
        gsap.set(l1, { y: -5, rotation: 0 });
        gsap.set(l2, { y: 5, rotation: 0 });
      }
      return;
    }

    if (isOpen) {
      gsap.to(l1, { y: 0, rotation: 45, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { y: 0, rotation: -45, duration: 0.35, ease: 'power3.inOut' });
    } else {
      gsap.to(l1, { y: -5, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { y: 5, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
    }
  }, [isOpen]);

  return (
    <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
      <span ref={line1Ref} className="absolute w-full h-[2px] bg-white rounded-full" style={{ transformOrigin: 'center' }} />
      <span ref={line2Ref} className="absolute w-full h-[2px] bg-white rounded-full" style={{ transformOrigin: 'center' }} />
    </div>
  );
};

interface LinkItem {
  name: string;
  href: string;
  menuOnly?: boolean;
}

interface FullscreenMenuProps {
  isOpen: boolean;
  isTransitioning: boolean;
  onClose: () => void;
  handleLinkClick: (href: string) => void;
  links: LinkItem[];
  onOpenRecruiterHub: () => void;
  onOpenAiAssistant: () => void;
  onOpenBuyMeCoffee: () => void;
}

const FullscreenMenu: React.FC<FullscreenMenuProps> = ({
  isOpen,
  isTransitioning,
  onClose,
  handleLinkClick,
  links,
  onOpenRecruiterHub,
  onOpenAiAssistant,
  onOpenBuyMeCoffee,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBotRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const magnetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { playClickSound, playHoverSound } = useSound();

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen && !isTransitioning) {
      if (tlRef.current) tlRef.current.kill();
      gsap.set(panelRef.current, { display: 'flex' });
      gsap.set(overlayRef.current, { display: 'block' });

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      tl.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power4.out' }, '-=0.2');
      tl.fromTo(lineTopRef.current, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.3, ease: 'power3.out' }, '-=0.2');
      tl.fromTo(lineBotRef.current, { scaleX: 0, transformOrigin: 'right' }, { scaleX: 1, duration: 0.3, ease: 'power3.out' }, '-=0.25');

      linksRef.current.forEach((link, i) => {
        if (!link) return;
        const chars = link.querySelectorAll('.char');
        tl.fromTo(
          chars, { y: '120%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.35, stagger: 0.015, ease: 'power4.out' },
          `-=${i === 0 ? 0.1 : 0.3}`,
        );
      });

      tl.fromTo(metaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.22');
    } else if (!isOpen) {
      if (tlRef.current) tlRef.current.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          if (panelRef.current) gsap.set(panelRef.current, { display: 'none' });
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' });
        },
      });
      tlRef.current = tl;

      tl.to(metaRef.current, { y: 15, opacity: 0, duration: 0.15, ease: 'power2.in' });

      linksRef.current.forEach((link, i) => {
        if (!link) return;
        const chars = link.querySelectorAll('.char');
        tl.to(chars, { y: '-120%', opacity: 0, duration: 0.18, stagger: 0.01, ease: 'power3.in' }, i === 0 ? '-=0.05' : '-=0.15');
      });

      tl.to([lineTopRef.current, lineBotRef.current], { scaleX: 0, duration: 0.18, ease: 'power2.in' }, '-=0.1');
      tl.to(panelRef.current, { x: '100%', duration: 0.28, ease: 'power4.in' }, '-=0.12');
      tl.to(overlayRef.current, { opacity: 0, duration: 0.18 }, '-=0.18');
    }
  }, [isOpen, isTransitioning]);

  const handleMagneticMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const el = magnetRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.25;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleMagneticMouseLeave = (index: number) => {
    const el = magnetRefs.current[index];
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <div ref={menuRef}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9980] bg-black/60 backdrop-blur-sm"
        style={{ display: 'none' }}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full md:w-[55%] z-[9981] bg-surface flex flex-col overflow-hidden"
        style={{ display: 'none', transform: 'translateX(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={lineTopRef}
          className="absolute top-[72px] left-0 right-0 h-px bg-border-subtler"
          style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
        />
        <div
          ref={lineBotRef}
          className="absolute bottom-[200px] md:bottom-[120px] left-0 right-0 h-px bg-border-subtler"
          style={{ transformOrigin: 'right', transform: 'scaleX(0)' }}
        />

        <div className="flex justify-between items-center px-10 h-20 border-b border-elevated-dark">
          <span className="text-gray-mid font-mono text-xs tracking-widest uppercase">Navigation</span>
        </div>

        <nav className="absolute top-[80px] bottom-[200px] md:bottom-[120px] left-0 right-0 flex flex-col justify-center px-10 md:px-16 gap-2">
          {links.map((link, i) => (
            <div
              key={link.href}
              ref={(el) => { linksRef.current[i] = el; }}
              className="overflow-hidden py-1.5"
            >
              <div
                ref={(el) => { magnetRefs.current[i] = el; }}
                onMouseMove={(e) => handleMagneticMouseMove(e, i)}
                onMouseLeave={() => handleMagneticMouseLeave(i)}
                className="inline-block"
              >
                <button
                  onClick={() => {
                    playClickSound();
                    handleLinkClick(link.href);
                  }}
                  onMouseEnter={playHoverSound}
                  className="group flex items-center gap-4 md:gap-6 text-left animate-link-row"
                >
                  <span className="text-gray-mid font-mono text-xs md:text-sm transition-colors duration-300 group-hover:text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] font-black uppercase leading-none tracking-tight text-cream hover:text-accent transition-colors duration-300 flex overflow-hidden">
                    {link.name.split('').map((char, ci) => (
                      <span
                        key={ci}
                        className="char inline-block"
                        style={{ transform: 'translateY(120%)', opacity: 0 }}
                      >
                        {char === ' ' ? ' ' : char}
                      </span>
                    ))}
                  </span>
                  <span className="text-accent text-3xl md:text-4xl opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}

          {/* Quick Recruiter & Support Tools in Menu */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenRecruiterHub();
              }}
              onMouseEnter={playHoverSound}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent/90 transition-all"
            >
              <FiBriefcase className="w-4 h-4" />
              <span>Recruiter Hub</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAiAssistant();
              }}
              onMouseEnter={playHoverSound}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-cream font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/20 border border-white/15 transition-all"
            >
              <FiCpu className="w-4 h-4 text-accent" />
              <span>Ask AI Bot</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenBuyMeCoffee();
              }}
              onMouseEnter={playHoverSound}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/20 text-cream font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent/30 border border-accent/40 transition-all"
            >
              <FiCoffee className="w-4 h-4 text-accent" />
              <span>Buy Me a Coffee ☕</span>
            </button>
          </div>
        </nav>

        <div
          ref={metaRef}
          className="absolute bottom-0 left-0 right-0 h-[200px] md:h-[120px] pl-10 pr-10 md:px-16 pt-4 pb-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-end"
          style={{ opacity: 0 }}
        >
          <div className="space-y-1 text-left">
            <p className="text-gray-mid font-mono text-xs uppercase tracking-widest mb-1">Get in Touch</p>
            <a
              href="mailto:bholevaibhav257@gmail.com"
              className="text-muted hover:text-white text-xs sm:text-sm font-mono transition-colors duration-200"
            >
              bholevaibhav257@gmail.com
            </a>
          </div>

          <div className="flex gap-4 justify-start flex-wrap">
            {[
              { label: 'GitHub', href: 'https://github.com/vbhole257' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vaibhav-bhole-0302/' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-mid hover:text-cream text-xs font-mono uppercase tracking-widest transition-colors duration-200 underline-offset-4 hover:underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavbarProps {
  hamburgerOnly?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hamburgerOnly = false }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLElement>(null);
  const linksContainerRef = useRef<HTMLUListElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isRecruiterHubOpen, setIsRecruiterHubOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState<boolean>(false);
  const [preloaderComplete, setPreloaderComplete] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [shouldHideNav, setShouldHideNav] = useState<boolean>(false);

  const lenisRef = useLenis() as React.RefObject<Lenis | null> | null;
  const lenis = lenisRef?.current;
  const { stage, isReady } = useTransitionState();
  const isTransitioning = stage === 'entering' || stage === 'leaving';

  const { playClickSound, playHoverSound } = useSound();

  useEffect(() => {
    const hasShownPreloader = sessionStorage.getItem('preloader-shown');
    if (hasShownPreloader) {
      setPreloaderComplete(true);
    } else {
      const handler = () => setPreloaderComplete(true);
      window.addEventListener('preloaderComplete', handler);
      return () => window.removeEventListener('preloaderComplete', handler);
    }
  }, []);

  useEffect(() => {
    if (hamburgerOnly) return;
    const checkScrollPosition = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setShouldHideNav(scrollY > 80);
    };
    checkScrollPosition();
    const timer = setTimeout(checkScrollPosition, 50);
    return () => clearTimeout(timer);
  }, [hamburgerOnly, isReady]);

  useEffect(() => {
    if (hamburgerOnly) {
      if (hamburgerRef.current) {
        gsap.set(hamburgerRef.current, { opacity: 1, scale: 1 });
      }
      return;
    }

    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    const logo = logoRef.current;
    const linksContainer = linksContainerRef.current;
    if (!nav || !hamburger) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollProgress = Math.min(scrollY / 80, 1);

    gsap.set(nav, { y: -120 * scrollProgress, opacity: 1 });
    if (mobileNav) gsap.set(mobileNav, { y: -190 * scrollProgress, opacity: 1 });

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      gsap.set(hamburger, { opacity: 1, scale: 1 });
    } else {
      const aboutWrapper = document.getElementById('about-section-wrapper');
      if (aboutWrapper) {
        const aboutTop = aboutWrapper.getBoundingClientRect().top + scrollY;
        const shouldShowHamburger = scrollY >= aboutTop;
        gsap.set(hamburger, {
          opacity: shouldShowHamburger ? 1 : 0,
          scale: shouldShowHamburger ? 1 : 0,
        });
      } else {
        gsap.set(hamburger, { opacity: 0, scale: 0 });
      }
    }

    if (logo) gsap.set(logo, { x: shouldHideNav ? 0 : -50, opacity: shouldHideNav ? 1 : 0 });
    if (linksContainer) {
      const links = linksContainer.querySelectorAll('li');
      gsap.set(links, { y: shouldHideNav ? 0 : -20, opacity: shouldHideNav ? 1 : 0 });
    }
  }, [hamburgerOnly, shouldHideNav]);

  useEffect(() => {
    if (hamburgerOnly) return;
    if (!preloaderComplete || !isReady || isTransitioning) return;
    if (hasAnimated) return;
    if (shouldHideNav) {
      setHasAnimated(true);
      return;
    }

    const logo = logoRef.current;
    const linksContainer = linksContainerRef.current;

    const timer = setTimeout(() => {
      if (logo) {
        gsap.to(logo, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 });
      }
      if (linksContainer) {
        const links = linksContainer.querySelectorAll('li');
        gsap.to(links, { y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'power2.out', delay: 0.5 });
      }
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [preloaderComplete, isReady, hasAnimated, hamburgerOnly, isTransitioning, shouldHideNav]);

  useEffect(() => {
    if (hamburgerOnly) return;
    if (!hasAnimated || isTransitioning) return;

    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    if (!nav || !hamburger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=80',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(nav, { y: -120 * progress, duration: 0 });
        if (mobileNav) gsap.to(mobileNav, { y: -190 * progress, duration: 0 });
      },
    });

    const isMobile = window.innerWidth < 768;
    const aboutWrapper = document.getElementById('about-section-wrapper');
    let aboutTrigger: ScrollTrigger | null = null;

    if (aboutWrapper && !isMobile) {
      aboutTrigger = ScrollTrigger.create({
        trigger: aboutWrapper,
        start: 'top top',
        end: 'top -200px',
        onEnter: () => {
          gsap.to(hamburger, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
        },
        onLeaveBack: () => {
          gsap.to(hamburger, { opacity: 0, scale: 0, duration: 0.3, ease: 'power2.in' });
        },
      });
    } else if (isMobile) {
      gsap.set(hamburger, { opacity: 1, scale: 1 });
    }

    return () => {
      scrollTrigger.kill();
      if (aboutTrigger) aboutTrigger.kill();
    };
  }, [hasAnimated, hamburgerOnly, isTransitioning]);

  useEffect(() => {
    if (!lenis) return;
    if (isMenuOpen || isRecruiterHubOpen || isAiModalOpen || isCoffeeModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
      ScrollTrigger.refresh();
    }
    document.body.style.overflow = isMenuOpen || isRecruiterHubOpen || isAiModalOpen || isCoffeeModalOpen ? 'hidden' : '';
  }, [isMenuOpen, isRecruiterHubOpen, isAiModalOpen, isCoffeeModalOpen, lenis]);

  useEffect(() => {
    if (isTransitioning && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isTransitioning, isMenuOpen]);

  const toggleMenu = () => {
    playClickSound();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = useHandleLinkClick(setIsMenuOpen);

  const links = [
    { name: 'Home', href: '/#top', menuOnly: true },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#projects' },
    { name: 'Contact', href: '/#contact' },
  ];

  const navStyle: React.CSSProperties = {
    opacity: isTransitioning ? 0 : 1,
    pointerEvents: isTransitioning ? 'none' : 'auto',
    transition: 'opacity 0.5s ease-in-out',
  };

  return (
    <>
      {!hamburgerOnly && (
        <nav
          ref={navRef}
          className="hidden md:block fixed w-full py-5 z-50 bg-cream/90 backdrop-blur-md border-b border-warm/10"
          style={navStyle}
        >
          <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center">
            {/* Left: Logo & Live Status Ticker */}
            <div className="flex items-center gap-6">
              <strong
                ref={logoRef}
                className="text-warm text-lg font-sans tracking-wide font-medium cursor-pointer"
                onClick={() => handleLinkClick('/#top')}
              >
                Vaibhav.
              </strong>
              <LiveStatusBadge />
            </div>

            {/* Right: Nav Links & Recruiter Tools */}
            <div className="flex items-center gap-6">
              <ul
                ref={linksContainerRef}
                className="flex items-center gap-6 text-warm text-sm font-sans font-medium uppercase tracking-wider"
              >
                {links.filter((l) => !l.menuOnly).map((link) => (
                  <AnimatedLink key={link.href}>
                    <a
                      href={link.href}
                      onMouseEnter={playHoverSound}
                      onClick={(e) => {
                        e.preventDefault();
                        playClickSound();
                        handleLinkClick(link.href);
                      }}
                    >
                      {link.name}
                    </a>
                  </AnimatedLink>
                ))}
              </ul>

              {/* Recruiter Fast-Track Hub Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsRecruiterHubOpen(true);
                }}
                onMouseEnter={playHoverSound}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shadow-accent/20 hover:scale-105 active:scale-95"
              >
                <FiBriefcase className="w-3.5 h-3.5" />
                <span>Hire Me</span>
              </button>

              {/* Buy Coffee CTA - High-Contrast & Prominently Visible */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsCoffeeModalOpen(true);
                }}
                onMouseEnter={playHoverSound}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink text-cream border border-charcoal/30 hover:border-accent hover:bg-accent hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-black/10 hover:scale-105 active:scale-95 group"
                title="Support with a coffee"
              >
                <FiCoffee className="w-3.5 h-3.5 text-accent group-hover:text-white transition-colors" />
                <span>Buy Coffee ☕</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Floating Bottom-Right Ask AI Widget */}
      <button
        onClick={() => {
          playClickSound();
          setIsAiModalOpen(true);
        }}
        onMouseEnter={playHoverSound}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9970] inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-accent text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xl hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all group touch-manipulation"
        title="Ask Vaibhav’s AI Assistant"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <FiCpu className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        <span>Ask AI</span>
      </button>

      {!hamburgerOnly && (
        <nav
          ref={mobileNavRef}
          className="mobile-navbar md:hidden fixed w-full z-50 bg-cream/90 backdrop-blur-md border-b border-warm/10"
          style={navStyle}
        >
          <div className="flex justify-between items-center px-4 h-16 w-full">
            <div className="flex items-center gap-3">
              <strong className="text-warm text-base font-sans tracking-wide font-medium">
                Vaibhav.
              </strong>
              <LiveStatusBadge compact />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setIsRecruiterHubOpen(true);
                }}
                className="px-2.5 py-1 rounded-full bg-accent text-white font-mono text-[11px] font-bold uppercase tracking-wider"
              >
                Hire Me
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setIsCoffeeModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink text-cream border border-charcoal/30 font-mono text-[11px] font-bold tracking-wider hover:bg-accent hover:text-white transition-all shadow-sm"
                title="Buy Coffee"
              >
                <span>☕</span>
                <span>Coffee</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className={`fixed top-5 md:top-6 right-6 z-[9982] w-10 h-10 md:w-12 md:h-12 rounded-full
          bg-elevated ${!hamburgerOnly ? 'md:bg-gray-btn' : ''}
          flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300`}
        style={
          hamburgerOnly
            ? { opacity: 1, scale: 1 }
            : {
                pointerEvents: isTransitioning ? 'none' : 'auto',
                transition: 'opacity 0.5s ease-in-out',
                ...(isTransitioning ? { opacity: 0, scale: 0 } : {}),
              }
        }
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        aria-controls="fullscreen-menu"
      >
        <AnimatedHamburger isOpen={isMenuOpen} />
      </button>

      <FullscreenMenu
        isOpen={isMenuOpen && !isTransitioning}
        isTransitioning={isTransitioning}
        onClose={() => setIsMenuOpen(false)}
        handleLinkClick={handleLinkClick}
        links={links}
        onOpenRecruiterHub={() => setIsRecruiterHubOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenBuyMeCoffee={() => setIsCoffeeModalOpen(true)}
      />

      {/* Recruiter, AI & Buy Coffee Modals */}
      <RecruiterHubModal
        isOpen={isRecruiterHubOpen}
        onClose={() => setIsRecruiterHubOpen(false)}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <BuyMeCoffeeModal
        isOpen={isCoffeeModalOpen}
        onClose={() => setIsCoffeeModalOpen(false)}
      />

      {/* One-time gentle welcome coffee toast */}
      <BuyCoffeeToast
        onOpenCoffeeModal={() => setIsCoffeeModalOpen(true)}
      />
    </>
  );
};

export default Navbar;
