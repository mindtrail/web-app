import { ReactNode } from 'react'

type textType = {
  children: JSX.Element | ReactNode
}

export function TypographyBlockquote({ children }: textType) {
  return <blockquote className='mt-6 border-l-2 pl-6 italic'>{children}</blockquote>
}
