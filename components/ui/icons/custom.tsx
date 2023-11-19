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
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M12.4475 1C13.0637 1.00468 13.0739 1.57812 12.8676 1.83276L9.46448 7.73047L9.46838 13C9.51526 13.6602 8.88245 13.7461 8.58948 13.4961L5.98792 11.7656C5.56604 11.4844 5.50354 11.4375 5.51917 11.0039L5.50861 7.73047L2.09749 1.83C1.89747 1.58 1.98839 1 2.52794 1.00001H5.19748L12.4475 1ZM3.3512 2.00391L11.6279 2L8.64026 7.16016C8.40254 7.61678 8.44834 7.61271 8.47229 8.00391L8.46792 12.2188L6.50792 10.9219V8.0027C6.51199 7.49219 6.55823 7.51953 6.34041 7.17559L3.3512 2.00391Z'
        fill='currentColor'
      />
    </svg>
  )
}

export { FilterIcon }
