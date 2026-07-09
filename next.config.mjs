/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Allow any remote images to load correctly in preview
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
