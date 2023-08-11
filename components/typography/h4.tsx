import { ReactNode } from 'react'

type textType = {
  children: ReactNode
}

export function TypographyH4({ children }: textType) {
  return <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>{children}</h4>
}
