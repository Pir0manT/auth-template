/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
 // output: 'standalone',
  experimental: {
    optimizePackageImports: ['@mui/lab','@mui/icons-material'],
  },
};


export default nextConfig;
