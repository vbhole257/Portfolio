'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Image from 'next/image';
import AnimateDescription from '@/components/ui/AnimateDescription';
import AnimatedHeading from '@/components/ui/AnimateHeading';

const About = () => {
  const headingText = 'Who Am I';
  const descriptionText =
    "I am a Lead Full Stack Engineer and AI Architect driven by a passion for building clean, intuitive, and reliable digital experiences.";
  const aboutMeText = `Versatile Full Stack Engineer and Architect with a proven track record of building complex enterprise systems from zero to one. Expert in modern React ecosystems (Next.js, Vite, Zustand) and scalable backends (Node.js/Express, Python/FastAPI, Prisma, PostgreSQL).

Highly proficient in AI-Augmented Development, leveraging Agentic AI (Claude 3.5, Gemini Pro) to achieve exceptional engineering velocity and ship end-to-end SaaS products and robust internal tools.

Whether I am designing zero-to-one architectures or integrating complex domains like mortgage operations, my core focus remains unchanged: creating scalable software that brings people joy, solves real problems, and leaves a lasting positive impact.`;
  
  const sectionRef = useRef<HTMLDivElement>(null);



  useGSAP(
    () => {
      gsap.fromTo(
        '.about-image-wrapper',
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          force3D: true,
          scrollTrigger: {
            trigger: '.about-image-wrapper',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
      gsap.fromTo(
        '.about-bio-para',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-bio-para',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
      gsap.fromTo(
        '.about-label',
        { opacity: 0, letterSpacing: '0.5em' },
        {
          opacity: 1,
          letterSpacing: '0.3em',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-label',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <div className="bg-cream">
      <section
        ref={sectionRef}
        id="about"
        className="min-h-screen bg-ink text-light py-24 md:py-32 rounded-t-4xl overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="mb-10 md:mb-20">
            <AnimatedHeading
              text={headingText}
              className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-4"
            />
            <AnimateDescription
              text={descriptionText}
              className="text-base sm:text-lg text-gray-soft font-sans"
            />
          </div>

          <div className="grid grid-cols-12 gap-8 md:gap-12 pb-20 items-center">
            <div className="col-span-12 md:col-span-5 lg:col-span-4 flex items-center justify-center">
              <div
                className="about-image-wrapper relative group w-full max-w-[280px] md:max-w-[320px] aspect-[4/5] bg-elevated-dark rounded-2xl overflow-hidden border border-border-subtler shadow-2xl [will-change:transform,opacity]"
              >
                <Image
                  src="/vaibhav-headshot.png"
                  alt="Vaibhav Bhole"
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                {/* Subtle gradient overlay to blend perfectly with dark theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 lg:col-span-8 flex flex-col justify-center space-y-8">
              <span className="about-label text-sm sm:text-base md:text-base text-warm uppercase tracking-[0.3em] font-medium text-center md:text-left inline-block">
                (About Me)
              </span>
              <div className="space-y-6">
                {aboutMeText.split('\n\n').map((p, i) => (
                  <p
                    key={i}
                    className="about-bio-para text-light/70 text-base sm:text-lg md:text-lg leading-relaxed font-sans"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

