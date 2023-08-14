import { ReactNode } from 'react'

type textType = {
  children: JSX.Element | ReactNode
}

export function TypographyMuted({ children }: textType) {
  return <p className='text-sm text-muted-foreground'>{children}</p>
}
