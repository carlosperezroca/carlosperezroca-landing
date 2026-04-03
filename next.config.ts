import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable streaming metadata to prevent SSR/client hydration mismatch
  // caused by inconsistent `hidden` attribute on MetadataWrapper div in Next.js 16
  htmlLimitedBots: /.*/,
};

export default nextConfig;
