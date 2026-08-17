'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';
import {
  SiReact, SiNextdotjs, SiTypescript, SiVite, SiTailwindcss, SiThreedotjs, SiFramer,
  SiNodedotjs, SiExpress, SiPython, SiFastapi,
  SiPostgresql, SiPrisma, SiSqlalchemy,
  SiDocker, SiGit, SiJest,
} from 'react-icons/si';
import { TbApi, TbNetwork } from 'react-icons/tb';
import { FaDatabase } from 'react-icons/fa';

const STACK_SECTIONS = [
  {
    id: 'frontend',
    title: 'FRONTEND',
    technologies: [
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Vite', icon: SiVite },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Zustand', icon: SiReact },
      { name: 'React Query', icon: SiReact },
      { name: 'Three.js', icon: SiThreedotjs },
      { name: 'Framer Motion', icon: SiFramer },
    ],
  },
  {
    id: 'backend',
    title: 'BACKEND',
    technologies: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
      { name: 'Python', icon: SiPython },
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'REST APIs', icon: TbApi },
    ],
  },
  {
    id: 'databases',
    title: 'DATABASES & ORM',
    technologies: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'Prisma ORM', icon: SiPrisma },
      { name: 'SQLAlchemy', icon: SiSqlalchemy },
      { name: 'Alembic', icon: FaDatabase },
    ],
  },
  {
    id: 'architecture',
    title: 'ARCHITECTURE',
    technologies: [
      { name: 'Microservices', icon: TbNetwork },
      { name: 'Docker', icon: SiDocker },
      { name: 'Git', icon: SiGit },
      { name: 'Jest', icon: SiJest },
      { name: 'Encompass', icon: TbApi },
    ],
  },
];

const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const headingText = 'Core Competencies';
  const descriptionText =
    'My technical toolkit for building enterprise-grade applications from zero to one.';

  useGSAP(
    () => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const items = section.querySelectorAll('.tech-item');
        const title = titleRefs.current[index];

        gsap.fromTo(
          title,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 70%', scrub: true },
          },
        );
        gsap.fromTo(
          items,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 70%', scrub: true },
          },
        );
      });
    },
    { scope: containerRef },
  );

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('svg');
    if (!icon) return;
    gsap.to(icon, { rotation: 360, scale: 1.2, duration: 0.6, ease: 'power2.out' });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('svg');
    if (!icon) return;
    gsap.to(icon, { rotation: 0, scale: 1, duration: 0.5, ease: 'power2.inOut' });
  };

  return (
    <section
      ref={containerRef}
      id="TechStack"
      className="bg-ink text-light py-24 md:py-32 rounded-b-4xl overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-14 hidden md:block">
          <AnimatedHeading
            text={headingText}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-4"
          />
          <AnimateDescription
            text={descriptionText}
            className="text-base sm:text-lg md:text-xl text-gray-soft font-sans leading-relaxed"
          />
        </div>

        <div className="mb-10 md:hidden">
          <AnimatedHeading
            text="My Stack"
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-black tracking-tight leading-none uppercase mb-4"
          />
        </div>

        <div className="space-y-24">
          {STACK_SECTIONS.map((stack, index) => (
            <div
              key={stack.id}
              ref={(el) => { sectionRefs.current[index] = el; }}
              className="flex flex-col md:flex-row md:items-start md:justify-between gap-8"
            >
              <h3
                ref={(el) => { titleRefs.current[index] = el; }}
                className="md:w-1/3 text-2xl sm:text-3xl md:text-4xl font-bold text-accent-light tracking-tight font-display uppercase"
              >
                {stack.title}
              </h3>

              <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {stack.technologies.map((tech, i) => (
                  <div
                    key={i}
                    className="tech-item flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-surface-mid cursor-pointer transition-all duration-300 hover:bg-elevated hover:border-white/10 hover:shadow-lg"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-2xl text-accent">
                      <tech.icon />
                    </div>
                    <p className="text-sm sm:text-base font-sans font-medium text-cream truncate">
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
