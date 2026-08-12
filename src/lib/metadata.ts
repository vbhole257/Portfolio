import { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: {
    default: 'Vaibhav Bhole - Lead Full Stack Engineer & AI Architect',
    template: '%s | Vaibhav Bhole',
  },
  description:
    'Portfolio of Vaibhav Bhole, Lead Full Stack Engineer & AI Architect specializing in React, Next.js, Node.js, Python, and AI-Augmented Development.',
  keywords: [
    'Vaibhav Bhole',
    'Web Developer',
    'Frontend Developer',
    'Full Stack Engineer',
    'AI Architect',
    'Next.js',
    'React',
    'Node.js',
    'Python',
    'Portfolio',
  ],
  authors: [
    {
      name: 'Vaibhav Bhole',
    },
  ],
  creator: 'Vaibhav Bhole',
  metadataBase: new URL('https://github.com/bholevaibhav'),
  alternates: {
    canonical: './',
  },
  icons: {
    icon: '/logo.webp',
  },
  openGraph: {
    title: 'Vaibhav Bhole - Lead Full Stack Engineer',
    description:
      'Portfolio of Vaibhav Bhole, Lead Full Stack Engineer & AI Architect specializing in enterprise systems and AI workflows.',
    url: 'https://github.com/bholevaibhav',
    siteName: 'Vaibhav Bhole Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vaibhav Bhole - Lead Full Stack Engineer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaibhav Bhole - Lead Full Stack Engineer',
    description:
      'Portfolio of Vaibhav Bhole, Lead Full Stack Engineer & AI Architect specializing in enterprise systems and AI workflows.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

