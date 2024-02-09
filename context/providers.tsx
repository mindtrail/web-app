'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SessionProvider } from 'next-auth/react'

import { GlobalStateProvider } from '@/context/global-state'

import { TooltipProvider } from '@/components/ui/tooltip'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export function Providers({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
      <TooltipProvider>
        <SessionProvider>
          <GlobalStateProvider>
            <DndProvider backend={HTML5Backend}>{children}</DndProvider>
          </GlobalStateProvider>
        </SessionProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
