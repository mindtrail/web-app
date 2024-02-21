import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'

import { Providers } from '@/context/providers'
import { Toaster } from '@/components/ui/toaster'
import { LeftSidebar } from '@/components/left-sidebar'
// import { SidebarRight } from '@/components/sidebar-right'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import Loading from '@/app/loading'
import { Suspense } from 'react'

// export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }],
}

export const metadata: Metadata = {
  title: {
    default: 'Mind Trail',
    template: `Mind Trail - %s`,
  },
  description: 'AI assitant to emember and structures everything you see online',
  icons: {
    icon: '/favicon.ico',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const user = session?.user
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='flex min-h-screen'>
        <Providers>
          <LeftSidebar user={user} />
          <main className='flex flex-1 overflow-auto'>
            <Suspense fallback={<Loading />}>{children}</Suspense>
            {/* <Separator orientation='vertical' /> */}
            {/* <SidebarRight /> */}
          </main>
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
