import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import { Typography } from '@/components/typography'

const breadcrumbStyles = cn(
  buttonVariants({ variant: 'secondaryLink' }),
  'px-0 h-8 nowrap shrink-0',
)

export function HistoryBreadcrumbs() {
  const [currentTitle, setCurrentTitle] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const pageTitle = document.title.split('-')?.pop()?.trim() || ''
    setCurrentTitle(pageTitle)
  }, [pathname])

  const pathItems = pathname.split('/').filter((x) => x)

  const currentPageTitle = (className = '') => (
    <Typography
      variant='small'
      className={cn('cursor-default text-foreground', className)}
    >
      {currentTitle}
    </Typography>
  )

  if (pathItems.length === 1) {
    return currentPageTitle('px-2')
  }

  const parent = 'All Items'
  const parentLink = '/all-items'

  const [entity] = pathItems

  return (
    <div className='flex justify-between items-center flex-wrap px-2'>
      <div className='flex items-center gap-1'>
        <Link className={`${breadcrumbStyles} `} href={parentLink}>
          {parent}
        </Link>
        <ChevronRightIcon />
        <Typography
          variant='small'
          className='text-foreground/70 cursor-default capitalize'
        >
          {entity}
        </Typography>
        <ChevronRightIcon />
      </div>
      {currentPageTitle()}
    </div>
  )
}
