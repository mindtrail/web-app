import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'

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
      <body className='flex min-h-screen'>
        <Providers>
          <SidebarNav className='' />
          <main className='flex flex-1'>
            <div className='flex flex-1 '>{children}</div>
            <div className='flex flex-col w-[200px]'>Right Sidebar</div>
          </main>
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
