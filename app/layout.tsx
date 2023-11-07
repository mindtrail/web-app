import '@/styles/globals.css'
import { Metadata } from 'next'
import { Viewport } from 'next'

import { Providers } from '@/context/providers'
import { Toaster } from '@/components/ui/toaster'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/components/sidebar-nav'
import { Header } from '@/components/header'

// export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }],
}

export const metadata: Metadata = {
  title: {
    default: 'Mind Trail',
    template: `Mind Trail - %s`,
  },
  description:
    'AI assitant to emember and structures everything you see online',
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
          <main className='flex flex-col flex-1 w-full h-full items-center'>
            <Header />

            <div className='flex flex-col flex-1 w-full'>
              <div className='flex flex-col w-full flex-1 md:flex-row lg:gap-10'>
                <aside className='flex flex-shrink-0 basis-44'>
                  <SidebarNav />
                  {/* <Separator
                    orientation='vertical'
                    className='hidden md:flex'
                  /> */}
                </aside>
                <div className='flex-1 flex max-w-3xl'>{children}</div>
              </div>
            </div>
          </main>
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
