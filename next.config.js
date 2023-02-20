const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */

const nextConfig = withPWA({
  experimental: {
    scrollRestoration: true,
  },
  images: {
    disableStaticImages: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })
    return config
  },
})

module.exports = nextConfig
