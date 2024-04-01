/** @type {import('next').NextConfig} */
const baseConfig = require('./next.config.base')

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  // reactStrictMode: false,
}

module.exports = nextConfig
