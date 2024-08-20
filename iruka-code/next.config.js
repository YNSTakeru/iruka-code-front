/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      canvas: 'commonjs canvas',
    });
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'liveblocks.io', port: '' },
    ],
    domains: ['files.edgestore.dev'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
