import Link from 'next/link'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Typography } from '@/components/typography'

type BreadcrumbsProps = { historyMetadata: HistoryMetadata }

const breadcrumbStyles = cn(
  buttonVariants({ variant: 'secondaryLink' }),
  'px-0 h-8 nowrap',
)

export function HistoryBreadcrumbs({ historyMetadata }: BreadcrumbsProps) {
  const { parent, parentLink = '/', subParent, name } = historyMetadata

  return (
    <div className='flex justify-between items-center flex-wrap px-2'>
      {parent && (
        <div className='flex items-center gap-1'>
          <Link className={`${breadcrumbStyles} shrink-0`} href={parentLink}>
            {parent}
          </Link>
          <ChevronRightIcon />
          <Typography variant='small' className='text-foreground/70 cursor-default'>
            {subParent}
          </Typography>
          <ChevronRightIcon />
        </div>
      )}
      <Typography variant='small' className='cursor-default'>
        {name}
      </Typography>
    </div>
  )
}
