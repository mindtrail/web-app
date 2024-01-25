import { Typography } from '@/components/typography'
import Link from 'next/link'

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-right"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 6l6 6l-6 6" />
            </svg>
          </div>
        </div>
      )}
      <Typography variant="h5">{historyMetadata.name}</Typography>
    </div>
  )
}
