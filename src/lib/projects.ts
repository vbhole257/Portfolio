export interface Project {
  id: number;
  slug: string;
  title: string;
  year: string;
  tech: string[];
  description: string;
  myRole: string[];
  images: string[];
  hoverImage: string;
  github: string;
  liveUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    slug: 'hive-ecosystem',
    title: 'The Hive Ecosystem',
    year: '2024',
    tech: ['React', 'TypeScript', 'Vite', 'Python', 'FastAPI', 'Encompass API'],
    description:
      'A multi-portal mortgage origination platform ecosystem serving Loan Officers, Borrowers, and Escrow agents. Engineered a CLI-style onboarding wizard with robust route protection and dynamic rules-based forms for financial data.',
    myRole: [
      'Designed and built the multi-portal frontend ecosystem from scratch using React, TypeScript, and Vite.',
      'Collaborated intimately on the core Python/FastAPI backend to build a bidirectional sync engine connected to Ellie Mae Encompass.',
      'Actively debugged, optimized, and shipped backend fixes to ensure uninterrupted data flow.',
      'Implemented dynamic, rules-based forms parsing borrower inputs into the relational PostgreSQL domain graph.',
    ],
    images: [
      '/projects/hive/1.png',
      '/projects/hive/2.png',
    ],
    hoverImage: '/projects/hive/1.png',
    github: 'https://github.com/bholevaibhav',
    liveUrl: '',
  },
  {
    id: 2,
    slug: 'io-forms',
    title: 'IO-Forms',
    year: '2024',
    tech: ['Next.js', 'React', 'Python', 'FastAPI'],
    description:
      'A full-stack dynamic form builder application for creating, managing, and publishing dynamic forms tightly integrated with a high-performance backend.',
    myRole: [
      'Architected and developed a full-stack form builder application from the ground up.',
      'Built a highly interactive, drag-and-drop user interface using Next.js and React.',
      'Integrated tightly with a high-performance Python/FastAPI backend for data processing and form submission routing.',
    ],
    images: [
      '/projects/io-forms/1.png',
      '/projects/io-forms/2.png',
      '/projects/io-forms/3.png',
    ],
    hoverImage: '/projects/io-forms/1.png',
    github: 'https://github.com/bholevaibhav',
    liveUrl: '',
  },
  {
    id: 3,
    slug: 'phoenix-pm',
    title: 'Phoenix-PM',
    year: '2023',
    tech: ['React', 'Node.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    description:
      'A modern, high-performance internal project management application built to streamline company workflows, owning the entire stack from database schema to UI.',
    myRole: [
      'Architected and developed the internal project management application from scratch.',
      'Built a robust RESTful API using Node.js, Express, and TypeScript with Prisma ORM.',
      'Developed a dynamic, responsive client using React, Vite, Tailwind CSS, and Zustand.',
      'Containerized backend services using Docker and established a comprehensive test suite using Jest.',
    ],
    images: [
      '/Projects/ecommerce/1.webp',
      '/Projects/ecommerce/2.webp',
    ],
    hoverImage: '/Projects/ecommerce/1.webp',
    github: 'https://github.com/bholevaibhav',
    liveUrl: '',
  },
  {
    id: 4,
    slug: 'io-website',
    title: 'IO Website',
    year: '2023',
    tech: ['Next.js 16', 'Three.js', 'Framer Motion'],
    description:
      'A highly visual, performant marketing website showcasing advanced 3D rendering and micro-animations for enterprise SEO and marketing.',
    myRole: [
      'Built a highly visual, performant marketing website using Next.js 16.',
      'Integrated Three.js (react-three-fiber) for advanced 3D rendering.',
      'Added complex micro-animations using Framer Motion.',
    ],
    images: [
      '/projects/io-website/1.png',
    ],
    hoverImage: '/projects/io-website/1.png',
    github: 'https://github.com/bholevaibhav',
    liveUrl: '',
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}


