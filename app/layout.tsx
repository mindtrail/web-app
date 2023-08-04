import '@/styles/globals.css'

import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

import { Providers } from '@/app/context/providers'
import { TailwindIndicator } from '@/components/tailwind-indicator'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Indie Chat',
    template: `%s - Indie Chat`,
  },
  description: 'An AI-powered chatbot for your docs and website.',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }],
  icons: {
    icon: '/favicon.ico',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='flex flex-col min-h-screen'>
        <Providers>
          <Toaster />
          <main className='flex flex-col flex-1 w-full'>{children}</main>
          <TailwindIndicator />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
