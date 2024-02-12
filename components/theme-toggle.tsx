'use client'

import { useState, useEffect, useTransition } from 'react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons/next-icons'

export function ThemeToggle({ className }: ButtonProps) {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = useTransition()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <Button
      size='icon'
      variant='ghost'
      className={cn(className)}
      onClick={() =>
        startTransition(() => setTheme(theme === 'light' ? 'dark' : 'light'))
      }
    >
      {hasMounted ? (
        !theme ? null : theme === 'dark' ? (
          <IconMoon className='transition-all' />
        ) : (
          <IconSun className='transition-all' />
        )
      ) : null}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
