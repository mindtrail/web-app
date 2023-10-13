import '@/styles/globals.css'
import { Metadata } from 'next'

import { Providers } from '@/context/providers'
import { Toaster } from '@/components/ui/toaster'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/components/sidebar-nav'
import Typography from '@/components/typography'
import { Header } from '@/components/header'

export const dynamic = 'force-dynamic'

const sidebarNavItems = [
  {
    title: 'Search',
    href: '/search',
  },
  {
    title: 'History',
    href: '/history',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
  {
    title: 'Import',
    href: '/examples/forms/notifications',
  },
  {
    title: 'Files',
    href: '/examples/forms/display',
  },
]

export const metadata: Metadata = {
  title: {
    default: 'Mind Trail',
    template: `Mind Trail - %s`,
  },
  description:
    'AI assitant to emember and structures everything you see online',
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
          <main className='flex flex-col flex-1 w-full items-center'>
            <Header />

            <div className='pt-8 w-full max-w-7xl sm:px-6 px-12'>
              <div className='space-y-0.5'>
                <Typography variant='h3'>Your online journey</Typography>
                <Typography variant='p' className='text-muted-foreground'>
                  Manage your account settings and set e-mail preferences.
                </Typography>
              </div>
              <Separator className='my-6' />
              <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
                <aside className='-mx-4 lg:w-1/5'>
                  <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className='flex-1 lg:max-w-2xl'>{children}</div>
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
