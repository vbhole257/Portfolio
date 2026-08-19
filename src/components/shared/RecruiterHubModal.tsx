'use client';

import React, { useState, useEffect } from 'react';
import { useSound } from '@/components/providers/SoundProvider';
import { FiDownload, FiMail, FiLinkedin, FiGithub, FiCheckCircle, FiX, FiCheck } from 'react-icons/fi';

interface RecruiterHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecruiterHubModal({ isOpen, onClose }: RecruiterHubModalProps) {
  const { playClickSound, playHoverSound, playSuccessSound } = useSound();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    playSuccessSound();
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={() => { playClickSound(); onClose(); }} />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl max-h-[90dvh] bg-cream dark:bg-ink border border-charcoal/20 dark:border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto overscroll-contain touch-pan-y text-charcoal dark:text-cream z-10"
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-charcoal/10 dark:border-white/10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <h2 className="font-mono text-sm sm:text-lg font-black uppercase tracking-wide">Recruiter Fast-Track Hub</h2>
              <p className="text-[10px] sm:text-xs text-gray-soft font-mono">1-Click candidate summary & direct contact</p>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            onMouseEnter={playHoverSound}
            className="p-2 rounded-full hover:bg-charcoal/10 dark:hover:bg-white/10 transition-colors text-charcoal dark:text-cream"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          {/* Quick Resume Download CTA */}
          <div className="p-4 sm:p-5 rounded-2xl bg-accent/10 border border-accent/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="font-mono font-bold text-xs sm:text-sm text-accent uppercase tracking-wider">Official Resume (PDF)</h3>
              <p className="text-[11px] sm:text-xs text-charcoal/80 dark:text-cream/80 mt-0.5 font-sans">
                Full-Stack & Frontend Engineering profile, project metrics, and work history.
              </p>
            </div>
            <a
              href="/Vaibhav_Bhole_Resume.pdf"
              download="Vaibhav_Bhole_Resume.pdf"
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>

          {/* Candidate Snapshot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 sm:p-4 rounded-xl bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 space-y-1">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-soft">Experience & Role</span>
              <p className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                Software Developer (3+ Yrs Exp)
              </p>
              <p className="font-mono text-[10px] text-gray-soft">IO DataLabs Pvt Ltd. (Canada/Remote)</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 space-y-1">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-soft">Core Stack</span>
              <p className="font-mono font-bold text-xs">
                React, Next.js, TypeScript, Node.js, FastAPI, PostgreSQL, AWS
              </p>
            </div>
          </div>

          {/* 30-Second Qualification Checklist */}
          <div className="space-y-2">
            <h4 className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-soft">30-Second Qualification Highlights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              <div className="flex items-center gap-2 text-charcoal/90 dark:text-cream/90">
                <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>3+ Years Production B2B SaaS Architecture</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/90 dark:text-cream/90">
                <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>REST APIs with Node.js & FastAPI</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/90 dark:text-cream/90">
                <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI Automation & Multi-LLM Workflows (Claude/Gemini)</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/90 dark:text-cream/90">
                <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AWS, Docker, CI/CD & Multi-Tenant Security</span>
              </div>
            </div>
          </div>

          {/* Contact Fast-Track Buttons */}
          <div className="pt-2 border-t border-charcoal/10 dark:border-white/10 flex flex-wrap gap-2">
            <button
              onClick={() => handleCopy('vbhole257@gmail.com', 'email')}
              onMouseEnter={playHoverSound}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal/10 dark:hover:bg-white/10 border border-charcoal/10 dark:border-white/10 font-mono text-xs transition-colors"
            >
              {copiedItem === 'email' ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiMail className="w-4 h-4 text-accent" />}
              <span>{copiedItem === 'email' ? 'Email Copied!' : 'Copy Email'}</span>
            </button>

            <button
              onClick={() => handleCopy('+91 7611111302', 'phone')}
              onMouseEnter={playHoverSound}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal/10 dark:hover:bg-white/10 border border-charcoal/10 dark:border-white/10 font-mono text-xs transition-colors"
            >
              {copiedItem === 'phone' ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <span>📞</span>}
              <span>{copiedItem === 'phone' ? 'Phone Copied!' : '+91 7611111302'}</span>
            </button>

            <a
              href="https://github.com/vbhole257"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal/10 dark:hover:bg-white/10 border border-charcoal/10 dark:border-white/10 font-mono text-xs transition-colors"
            >
              <FiGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/vaibhav-bhole-0302/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-charcoal/5 dark:bg-white/5 hover:bg-charcoal/10 dark:hover:bg-white/10 border border-charcoal/10 dark:border-white/10 font-mono text-xs transition-colors"
            >
              <FiLinkedin className="w-4 h-4 text-blue-500" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
