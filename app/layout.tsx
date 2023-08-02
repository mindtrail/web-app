import '@/styles/globals.css'

import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { getServerSession } from 'next-auth/next'

import { authOptions } from 'lib/authOptions'

import { Providers } from 'context/providers'
import { Header } from '@/components/header'
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
  const session = await getServerSession(authOptions)

  return (
    <html lang='en' suppressHydrationWarning>
      <body className='flex flex-col min-h-screen'>
        <Providers>
          <Toaster />
          <div className='flex flex-col flex-1 w-full'>
            {/* @ts-ignore Server Component */}
            <Header session={session}/>
            <main className='flex flex-col flex-1 w-full items-center bg-muted/50'>
              <div className='flex flex-col flex-1 w-full max-w-6xl'>{children}</div>
            </main>
          </div>
          <TailwindIndicator />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
