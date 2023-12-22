/** @type {import('next').NextConfig} */
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // loader: 'cloudinary',
    // path: 'https://res.cloudinary.com/',
  },
  experimental: {
    serverComponentsExternalPackages: ['langchain', 'cheerio', 'html-to-text'],
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
