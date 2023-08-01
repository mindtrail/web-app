import '@/styles/globals.css'

import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

import { Providers } from '@/app/context/providers'
import { LeftSidebar } from '@/components/sidebar'
import { TailwindIndicator } from '@/components/tailwind-indicator'

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

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Providers>
          <Toaster />
          <div className='flex flex-col min-h-screen sm:flex-row'>
            <LeftSidebar />
            <main className='flex flex-col flex-1 relative items-center bg-muted/50 px-4'>
              {children}
            </main>
          </div>
          <TailwindIndicator />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
