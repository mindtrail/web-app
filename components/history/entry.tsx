import { MouseEvent, useCallback, useMemo } from 'react'
import Link from 'next/link'

import { addHttpsIfMissing } from '@/lib/utils'

type HistoryItemProps = {
  historyItem: HistoryItem
  filters?: HistoryFilter[]
  columns: HistoryFilter[]
  gridStyle: string
  handleTagListClick: (event: MouseEvent<HTMLButtonElement>) => void
  handleHistoryDelete: (
    event: MouseEvent<HTMLButtonElement>,
    historyItem: HistoryItem,
  ) => void
}

export const HistoryEntry = ({
  historyItem,
  filters,
  gridStyle,
  handleTagListClick,
  handleHistoryDelete,
}: HistoryItemProps) => {
  const { name, displayName } = historyItem

  const handleDelete = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      handleHistoryDelete(event, historyItem)
    },
    [handleHistoryDelete, historyItem],
  )

  return (
    <div className={`${gridStyle} w-full group border rounded-md py-2`}>
      <div className='flex flex-col gap-2 relative'>
        <div className='flex w-full'>
          <span className='max-w-xs text-ellipsis overflow-hidden whitespace-nowrap'>
            <Link
              target='_blank'
              href={addHttpsIfMissing(name)}
              className='flex group justify-between items-center gap-2'
            >
              {displayName}
            </Link>
          </span>
        </div>
        <div className='w-full h-20 bg-slate-100'></div>
      </div>

      <div className='flex gap-2 flex-wrap'></div>
      <span>Action</span>
      <span>Action</span>
    </div>
  )
}
