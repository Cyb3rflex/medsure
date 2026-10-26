/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  eslint: {
    // Avoid blocking production deployments on minor lint formatting warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep build resilient
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
