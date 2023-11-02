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

const sidebarNavItems = [
  {
    title: 'History',
    href: '/history',
  },
  {
    title: 'Search',
    href: '/search',
  },
  {
    title: 'Chat',
    href: '/chat',
  },
  {
    title: 'Import',
    href: '/import',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
]

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

            <div className='flex flex-col flex-1 w-full max-w-7xl sm:px-6 px-12'>
              <div className='flex flex-col w-full flex-1 lg:flex-row lg:gap-12'>
                <aside className='-mx-4 lg:w-1/5 flex '>
                  <SidebarNav
                    items={sidebarNavItems}
                    className='flex-1 mt-4 pr-2'
                  />
                  <Separator
                    orientation='vertical'
                    className='hidden lg:flex'
                  />
                </aside>
                <div className='flex-1 flex max-w-3xl w-full'>{children}</div>
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
