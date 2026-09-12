/**
 * @license
 * Copyright (c) 2026 Vaibhav Bhole. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 * Project: Portfolio
 * Author: Vaibhav Bhole (bholevaibhav)
 * Website: https://github.com/vbhole257
 */

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['gsap', 'lucide-react', 'react-icons'],
  },
  poweredByHeader: false,
  reactStrictMode: false,
};
export default nextConfig;
