// These styles apply to every route in the application
import '@/styles/globals.css'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

import AuthProvider from '@/app/context/authProvider'

const title = 'Next.js Prisma Postgres Auth Starter'
const description =
  'This is a Next.js starter kit that uses Next-Auth for simple email + password login and a Postgres database to persist the data.'

export const metadata: Metadata = {
  title,
  description,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
