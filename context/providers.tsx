'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SessionProvider } from 'next-auth/react'

import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider>
      <TooltipProvider>
        <SessionProvider>{children}</SessionProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
