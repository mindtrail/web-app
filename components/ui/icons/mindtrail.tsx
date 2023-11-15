'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function FilterIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-label='Filter'
      role='img'
      viewBox='0 0 15 15'
      className={cn('h-4 w-4', className)}
      {...props}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M2.5 1.5H12.5' stroke='black' stroke-linecap='round' />
      <path
        d='M8.983 7.58704L12.4842 1.52283'
        stroke='black'
        stroke-linecap='round'
      />
      <path
        d='M2.517 1.53296L6.01817 7.59716'
        stroke='black'
        stroke-linecap='round'
      />
      <path d='M6.03 11.12L6.03 7.62' stroke='black' stroke-linecap='round' />
      <path
        d='M8.94218 13.1214L6.03 11.18'
        stroke='black'
        stroke-linecap='round'
      />
      <path
        d='M8.98001 13.12L8.98001 7.62'
        stroke='black'
        stroke-linecap='round'
      />
    </svg>
  )
}

export { FilterIcon }
