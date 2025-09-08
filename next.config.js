/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    esmExternals: false,
  },
  swcMinify: true,
}

module.exports = nextConfig
