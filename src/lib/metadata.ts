import { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: {
    default: 'Vaibhav Bhole - Software Developer',
    template: '%s | Vaibhav Bhole',
  },
  description:
    'Portfolio of Vaibhav Bhole, a Software Developer specializing in React, Next.js, scalable frontend architecture, and AI-powered workflows.',
  keywords: [
    'Vaibhav Bhole',
    'Web Developer',
    'Frontend Developer',
    'Software Developer',
    'Next.js',
    'React',
    'TypeScript',
    'AI Workflows',
    'Portfolio',
  ],
  authors: [
    {
      name: 'Vaibhav Bhole',
    },
  ],
  creator: 'Vaibhav Bhole',
  metadataBase: new URL('https://github.com/vbhole257'),
  alternates: {
    canonical: './',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Vaibhav Bhole - Software Developer',
    description:
      'Portfolio of Vaibhav Bhole, a Software Developer specializing in scalable frontend architecture and AI workflows.',
    url: 'https://github.com/vbhole257',
    siteName: 'Vaibhav Bhole Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vaibhav Bhole - Software Developer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaibhav Bhole - Software Developer',
    description:
      'Portfolio of Vaibhav Bhole, a Software Developer specializing in scalable frontend architecture and AI workflows.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

