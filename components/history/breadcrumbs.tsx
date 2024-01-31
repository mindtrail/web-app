import { Typography } from '@/components/typography'
import Link from 'next/link'
import { IconChevronRight } from '../ui/icons/next-icons'

// @ts-ignore
export function HistoryBreadcrumbs({ historyMetadata }) {
  return (
    <div className="flex justify-between items-center">
      {historyMetadata.parent && (
        <div className="flex items-center">
          <div className="flex items-center">
            <Link href={historyMetadata.parentLink || '/'}>
              <Typography variant="p">{historyMetadata.parent}</Typography>
            </Link>
          </div>
          <div className="mx-1">
            <IconChevronRight />
          </div>
          <div className="flex items-center">
            <Typography variant="p">{historyMetadata.subParent}</Typography>
          </div>
          <div className="mx-1">
            <IconChevronRight />
          </div>
        </div>
      )}
      <Typography variant="h5">{historyMetadata.name}</Typography>
    </div>
  )
}
