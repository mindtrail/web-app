import { ReactNode } from 'react'

type textType = {
  children: JSX.Element | ReactNode
}

export function TypographySmall({ children }: textType) {
  return <small className='text-sm font-medium leading-none'>{children}</small>
}
