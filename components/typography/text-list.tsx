import { ReactNode } from 'react'

type textType = {
  children: string[] | ReactNode[]
}

export function TypographyList({ children = [] }: textType) {
  return (
    <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
      {children.map((child, index) => (
        <li key={index}>{child}</li>
      ))}
    </ul>
  )
}
