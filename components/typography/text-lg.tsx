import { ReactNode } from 'react'

type textType = {
  children: ReactNode
}

export function TypographyLarge({ children }: textType) {
  return <div className='text-lg font-semibold'>{children}</div>
}
