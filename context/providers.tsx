'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SessionProvider } from 'next-auth/react'

import { GlobalStateProvider } from '@/context/global-state'

import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider>
      <TooltipProvider>
        <SessionProvider>
          <GlobalStateProvider>{children}</GlobalStateProvider>
        </SessionProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
