import { ReactNode } from 'react'

type textType = {
  children: JSX.Element | ReactNode
}

export function TypographyP({ children }: textType) {
  return <p className='leading-7 [&:not(:first-child)]:mt-6'>{children}</p>
}
