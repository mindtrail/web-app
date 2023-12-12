import { MouseEvent, useCallback, useMemo } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
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
  const { id, name, tags, displayName, summary, createdAt } = historyItem

  const processedTags = useMemo(() => {
    const filterList = filters?.map((filter) => filter.value)
    return tags?.map((tag) => ({
      value: tag,
      selected: filterList?.includes(tag),
    }))
  }, [filters, tags])

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

      <div className='max-w-md lg:max-w-lg'>{summary}</div>

      <div className='flex gap-2 flex-wrap'>
        {processedTags?.map(({ value, selected }, index) => (
          <Button
            key={index}
            variant='secondary'
            size='sm'
            className={`hover:bg-slate-200
              ${selected && 'bg-slate-200'}
            `}
            data-value={value} // Set a data attribute
            onClick={handleTagListClick}
          >
            {value}
          </Button>
        ))}
      </div>
      <span>Action</span>
      <span>Action</span>
    </div>
  )
}
