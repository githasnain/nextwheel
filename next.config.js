/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // For base64 images
  },
  // Enable static exports if needed
  // output: 'standalone',
}

module.exports = nextConfig


