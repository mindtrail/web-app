import Link from 'next/link'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { Typography } from '@/components/typography'

// @ts-ignore
export function HistoryBreadcrumbs({ historyMetadata }) {
  return (
    <div className='flex justify-between items-center flex-wrap'>
      {historyMetadata.parent && (
        <div className='flex items-center'>
          <div className='flex items-center'>
            <Link href={historyMetadata.parentLink || '/'}>
              <Typography variant='p'>{historyMetadata.parent}</Typography>
            </Link>
          </div>
          <div className='mx-1'>
            <ChevronRightIcon width={20} height={20} />
          </div>
          <div className='flex items-center'>
            <Typography variant='p'>{historyMetadata.subParent}</Typography>
          </div>
          <div className='mx-1'>
            <ChevronRightIcon width={20} height={20} />
          </div>
        </div>
      )}
      <Typography variant='h5'>{historyMetadata.name}</Typography>
    </div>
  )
}
