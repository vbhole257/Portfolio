'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const allSections = servicesRef.current.filter(Boolean);
      const pinOffset = 50;
      allSections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: `top ${pinOffset + index * 100}px`,
          endTrigger: allSections[allSections.length - 1],
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const headingText = 'What I Do';
  const descriptionText =
    "I specialize in building complex enterprise systems and scaling products from zero to one. With a solid foundation in both frontend and backend technologies, I help bring ideas to life while leveraging AI to achieve exceptional engineering velocity.";

  const services = [
    {
      id: '01',
      title: 'Zero-to-One Architecture',
      description:
        'Successfully architected and deployed multiple enterprise products from scratch, serving as a one-person product and engineering powerhouse.',
      items: [
        'Frontend ecosystems (React, Vite, Next.js)',
        'Scalable backends (Node.js, FastAPI, Prisma)',
        'Multi-tenant Data Isolation',
      ],
    },
    {
      id: '02',
      title: 'System Integration & Backend',
      description:
        'Mastered complex domain-specific architectures by building bidirectional data sync engines and robust RESTful APIs. Actively debug, optimize, and ship backend fixes.',
      items: [
        'Node.js & Python/FastAPI',
        'PostgreSQL & Prisma ORM',
        'Real-time webhooks & integrations',
      ],
    },
    {
      id: '03',
      title: 'AI-Augmented Development',
      description:
        'Pioneered Agentic AI workflows to drastically cut time-to-market for major features. Achieved exceptional output velocity leveraging modern AI tools.',
      items: [
        'Claude 3.5 & Gemini Pro workflows',
        'AI Automation & Code Generation',
        'Rapid Tech Migrations',
      ],
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="min-h-screen bg-ink text-light py-24 md:py-32 px-6 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-20">
          <AnimatedHeading
            text={headingText}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-4"
          />

          <div className="grid md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-start-6 md:col-span-7 flex flex-col md:flex-row gap-3 md:gap-10">
              <span className="text-accent-light uppercase text-sm md:text-base font-bold tracking-[0.2em] whitespace-nowrap">
                (Services)
              </span>

              <AnimateDescription
                text={descriptionText}
                className="max-w-2xl text-base sm:text-lg md:text-xl text-gray-soft font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="relative pb-8 md:pb-24">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                servicesRef.current[index] = el;
              }}
              className="bg-ink pb-16 md:pb-32"
              style={{ zIndex: index + 1 }}
            >
              <div className="grid md:grid-cols-12 gap-4 items-center py-4 md:py-8 border-t border-border-subtle">
                <h3
                  className="font-display md:col-span-9 md:col-start-2 text-light font-bold text-2xl sm:text-2xl md:text-4xl lg:text-5xl leading-none"
                  style={{ transform: 'translateY(-0.1em)' }}
                >
                  {service.title}
                </h3>
              </div>

              <div className="grid md:grid-cols-12 gap-4 md:gap-8 pt-4 md:pt-6">
                <div className="md:col-span-7 md:col-start-6 space-y-4 md:space-y-6">
                  <p className="text-gray-soft text-base sm:text-base md:text-lg leading-relaxed font-sans">
                    {service.description}
                  </p>

                  <div className="divide-y divide-border-subtle">
                    {service.items.map((item, i) => (
                      <div key={i} className="py-3 flex items-center gap-3 md:gap-4">
                        <span className="text-accent-light text-xs md:text-sm font-mono font-bold">
                          0{i + 1}
                        </span>
                        <span className="text-base sm:text-base md:text-lg font-bold font-sans text-light">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
