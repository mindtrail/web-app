/** @type {import('next').NextConfig} */
// @TODO: add "output: 'standalone'," to nextConfig if I building a Docker image
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        'supports-color': 'supports-color',
      })
    }

    return config
  },
}

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error)
})

module.exports = nextConfig
