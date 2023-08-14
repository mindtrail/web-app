import { ReactNode } from 'react'

type textType = {
  children: ReactNode
}

export function TypographyH3({ children }: textType) {
  return <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{children}</h3>
}
