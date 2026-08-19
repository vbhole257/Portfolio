'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/components/providers/SoundProvider';
import { FiCpu, FiX, FiSend, FiUser } from 'react-icons/fi';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUESTIONS = [
  'What is Vaibhav’s experience & background?',
  'What is his core tech stack?',
  'Is he available for full-time roles?',
  'What backend, AI & cloud skills does he have?',
];

const KNOWLEDGE_BASE: Record<string, string> = {
  stack:
    'Vaibhav is a **Software Developer with 3+ years of professional experience** building production SaaS applications.\n\n• **Frontend**: React.js, Next.js, TypeScript, Vite, Tailwind CSS, Redux Toolkit, TanStack Query/Table, React Hook Form.\n• **Backend**: Node.js, Express.js, FastAPI, Django, REST APIs.\n• **Database**: PostgreSQL, Prisma ORM.\n• **Cloud & DevOps**: AWS, Docker, Docker Compose, GitHub Actions, Nginx, CI/CD.\n• **AI & Automation**: LLMs, Claude, Gemini, Prompt Engineering, AI Workflows.',
  experience:
    'Vaibhav currently works as a **Software Developer at IO DataLabs Pvt Ltd. (Canada / Remote)** since Jan 2023.\n\n• Built reusable React/TypeScript UI architecture across 3 B2B SaaS products.\n• Developed REST APIs with FastAPI & Node.js.\n• Engineered multi-LLM workflows using Claude & Gemini to automate form-generation logic (saving 8+ months of dev effort).\n• Integrated enterprise webhooks, RBAC, and bidirectional data sync.\n\nPreviously worked as a Design Engineer at Designers CAD CAM (2017 - 2022). Holds a B.E. in Mechanical Engineering from RGPV (2017).',
  available:
    'Yes! Vaibhav is **immediately available** for full-time Software Developer / Full-Stack / Frontend roles. Open to Remote, On-site, and Hybrid opportunities worldwide.',
  backend:
    'Vaibhav has robust backend, cloud & AI capabilities:\n• **REST APIs & Backend**: Node.js, Express.js, FastAPI, Django, JWT, RBAC, Multi-Tenant SaaS.\n• **Databases**: PostgreSQL, Prisma ORM.\n• **DevOps**: AWS, Docker, Docker Compose, GitHub Actions CI/CD.\n• **AI**: LLMs, Claude, Gemini prompt engineering & automated form logic.',
  projects:
    'Key Project Highlights from his resume:\n1. **JMJ Mortgage Platform (Hive)**: B2B Mortgage SaaS Platform with JSON-driven loan application wizard, TanStack Table & HelloSign e-signatures.\n2. **IO-forms**: Enterprise Form Builder with embeddable drag-and-drop form-rendering engine.\n3. **Phoenix-PM**: Multi-Tenant Project Management SaaS built with React, Node.js, Prisma, PostgreSQL, Docker & GitHub Actions CI/CD.\n4. **IO DataLabs Website**: Next.js 16 + Three.js interactive 3D corporate site.',
  contact:
    'You can contact Vaibhav directly:\n• **Email**: vbhole257@gmail.com\n• **Phone**: +91 7611111302\n• **LinkedIn**: linkedin.com/in/vaibhav-bhole-0302/\n• **GitHub**: github.com/vbhole257\n• **Portfolio**: vaibhav-bhole-portfolio.vercel.app',
};

export default function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
  const { playClickSound, playHoverSound, playSuccessSound } = useSound();
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Hello! I am Vaibhav’s AI Assistant. Ask me anything about his technical stack, project highlights, or job availability!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getAiAnswer = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('experience') || q.includes('background') || q.includes('company') || q.includes('datalabs') || q.includes('education') || q.includes('degree')) {
      return KNOWLEDGE_BASE.experience;
    }
    if (q.includes('stack') || q.includes('skill') || q.includes('technology') || q.includes('languages') || q.includes('frontend')) {
      return KNOWLEDGE_BASE.stack;
    }
    if (q.includes('available') || q.includes('job') || q.includes('role') || q.includes('hire') || q.includes('work') || q.includes('remote') || q.includes('location')) {
      return KNOWLEDGE_BASE.available;
    }
    if (q.includes('backend') || q.includes('database') || q.includes('node') || q.includes('api') || q.includes('cloud') || q.includes('aws') || q.includes('docker') || q.includes('ai') || q.includes('llm')) {
      return KNOWLEDGE_BASE.backend;
    }
    if (q.includes('project') || q.includes('hive') || q.includes('form') || q.includes('phoenix') || q.includes('portfolio') || q.includes('built')) {
      return KNOWLEDGE_BASE.projects;
    }
    if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('resume') || q.includes('phone') || q.includes('call')) {
      return KNOWLEDGE_BASE.contact;
    }
    return `Vaibhav is a Software Developer with 3+ years of professional experience building production SaaS applications across React.js, Next.js, TypeScript, Node.js, FastAPI, PostgreSQL, and AWS. Reach out via email at **vbhole257@gmail.com** or phone **+91 7611111302**!`;
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    playClickSound();

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getAiAnswer(query);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      playSuccessSound();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={() => { playClickSound(); onClose(); }} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl h-[600px] max-h-[85vh] bg-cream dark:bg-ink border border-charcoal/20 dark:border-white/15 rounded-3xl flex flex-col overflow-hidden shadow-2xl z-10 text-charcoal dark:text-cream">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10 dark:border-white/10 bg-charcoal/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/15 text-accent">
              <FiCpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <span>Ask Vaibhav’s AI Assistant</span>
                <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] text-accent font-semibold">
                  Recruiter Bot
                </span>
              </h2>
              <p className="text-[11px] text-gray-soft font-mono">Instant answers for qualification checklists</p>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); onClose(); }}
            onMouseEnter={playHoverSound}
            className="p-2 rounded-full hover:bg-charcoal/10 dark:hover:bg-white/10 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Questions Bar */}
        <div className="px-6 py-3 border-b border-charcoal/10 dark:border-white/10 bg-charcoal/2 dark:bg-white/2 flex gap-2 overflow-x-auto no-scrollbar">
          {PRESET_QUESTIONS.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pq)}
              onMouseEnter={playHoverSound}
              className="shrink-0 px-3 py-1.5 rounded-full bg-charcoal/5 dark:bg-white/5 hover:bg-accent/10 hover:border-accent/30 border border-charcoal/10 dark:border-white/10 text-[11px] font-mono transition-all text-left"
            >
              <span className="text-accent font-bold">?</span> {pq}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-1">
                  <FiCpu className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-accent text-white rounded-tr-none'
                    : 'bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                <div
                  className={`mt-1.5 text-[10px] font-mono text-right ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-gray-soft'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-charcoal/10 dark:bg-white/10 text-charcoal dark:text-cream flex items-center justify-center shrink-0 mt-1">
                  <FiUser className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center text-gray-soft text-xs font-mono">
              <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <FiCpu className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-charcoal/10 dark:border-white/10 bg-charcoal/5 dark:bg-white/5 flex gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about skills, experience, projects, or availability..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-cream dark:bg-ink border border-charcoal/15 dark:border-white/15 text-xs font-mono focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className="px-4 py-2.5 rounded-xl bg-accent text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-accent/90 transition-all shrink-0"
          >
            <span>Send</span>
            <FiSend className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
