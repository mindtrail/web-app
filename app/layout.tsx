import '@/styles/globals.css'
import '@/styles/prosemirror.css'

import { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Providers } from '@/context/providers'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { LeftSidebar } from '@/components/left-sidebar'
import { SidebarRight } from '@/components/sidebar-right'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import Loading from '@/app/loading'

import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

//import Image from 'next/image'
// export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'white' }],
}

export const metadata: Metadata = {
  title: {
    default: 'EZ RPA',
    template: `EZ RPA - %s`,
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

  // if (!session?.user?.id) {
  //   return (
  //     <html lang='en' suppressHydrationWarning>
  //       <body className='flex min-h-screen'>
  //         <main className='flex flex-1 overflow-auto items-start sm:items-center justify-center pt-24 sm:pt-0'>
  //           <Image
  //             src='/soon.jpg'
  //             alt='comning soon'
  //             width={600}
  //             height={400}
  //             quality={85}
  //             className='max-w-[75%]'
  //             sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw'
  //           />
  //         </main>
  //       </body>
  //     </html>
  //   )
  // }
  const user = session?.user

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`flex min-h-screen ${inter.variable} font-sans`}>
        <Providers>
          <LeftSidebar user={user} />
          <main className='flex flex-1 overflow-auto'>
            <Suspense fallback={<Loading />}>{children}</Suspense>
            {/* <Separator orientation='vertical' /> */}
            {/* <SidebarRight /> */}
          </main>
          <TailwindIndicator />
          {/* @TODO: keep only one of the toasters -> Sonner seems really nice */}
          <Toaster />
          <SonnerToaster />
        </Providers>
      </body>
    </html>
  )
}
