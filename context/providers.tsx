'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SessionProvider } from 'next-auth/react'

import { GlobalStateProvider } from '@/context/global-state'

import { TooltipProvider } from '@/components/ui/tooltip'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import prismatic from '@prismatic-io/embedded'

export function Providers({ children }: ThemeProviderProps) {
  const [client, setClient] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`/api/integrations/prismatic`)
      const { token } = await res.json()
      prismatic.init()
      await prismatic.authenticate({ token })
      setClient(
        new ApolloClient({
          uri: `${process.env.NEXT_PUBLIC_PRISMATIC_HOST}/api`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          cache: new InMemoryCache(),
        }),
      )
    }

    init()
  }, [])

  if (!client) return null

  return (
    <ApolloProvider client={client}>
      <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
        <TooltipProvider>
          <SessionProvider>
            <GlobalStateProvider>
              <DndProvider backend={HTML5Backend}>{children}</DndProvider>
            </GlobalStateProvider>
          </SessionProvider>
        </TooltipProvider>
      </NextThemesProvider>
    </ApolloProvider>
  )
}
