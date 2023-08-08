'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'

interface LoginButtonProps extends ButtonProps {
  text?: string
}

export function LoginButton({ text, className, ...props }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Button
      variant='outline'
      onClick={() => {
        setIsLoading(true)
        signIn(undefined, { callbackUrl: '/chat' })
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? <IconSpinner className='mr-2 animate-spin' /> : null}
      {text}
    </Button>
  )
}
