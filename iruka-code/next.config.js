/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'liveblocks.io', port: '' },
    ],
    domains: ['files.edgestore.dev'],
  },
};

module.exports = nextConfig;
