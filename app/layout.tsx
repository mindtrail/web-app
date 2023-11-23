import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'

import { Providers } from '@/context/providers'
import { Toaster } from '@/components/ui/toaster'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Separator } from '@/components/ui/separator'
import { LeftSidebar } from '@/components/left-sidebar'
import { SidebarRight } from '@/components/sidebar-right'

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
          <LeftSidebar className='' />
          <main className='flex flex-1'>
            <div className='flex flex-1 '>{children}</div>
            <Separator orientation='vertical' />
            {/* <SidebarRight /> */}
          </main>
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
