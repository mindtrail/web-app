import { useMemo, useCallback, MouseEvent } from 'react'
import Link from 'next/link'
import { DataSrc } from '@prisma/client'
import { GlobeIcon, Cross1Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

type HistoryItem = DataSrc & {
  tags?: string[]
  displayName?: string
}

type TagList = {
  label: string
  value: string
}

type HistoryItemProps = {
  historyItem: HistoryItem
  filters?: TagList[]
  handleTagListClick: (event: MouseEvent<HTMLButtonElement>) => void
  handleHistoryDelete: (
    event: MouseEvent<HTMLButtonElement>,
    historyItem: HistoryItem,
  ) => void
}

const addHttpsIfMissing = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}

export const HistoryEntry = ({
  historyItem,
  filters,
  handleTagListClick,
  handleHistoryDelete,
}: HistoryItemProps) => {
  const { id, name, tags, displayName } = historyItem

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
    <Link
      target='_blank'
      href={addHttpsIfMissing(name)}
      className='flex group justify-between items-center relative'
    >
      <span className='flex gap-2 items-center '>
        <GlobeIcon className='text-green-500' />
        <span className='max-w-md lg:max-w-lg text-ellipsis overflow-hidden whitespace-nowrap'>
          {displayName}
        </span>
      </span>

      <span className='flex items-center gap-2 absolute right-0'>
        {processedTags?.map(({ value, selected }, index) => (
          <Button
            key={index}
            variant='secondary'
            size='sm'
            className={`invisible group-hover:visible hover:bg-slate-200
              ${selected && 'bg-slate-200'}
            `}
            data-value={value} // Set a data attribute
            onClick={handleTagListClick}
          >
            {value}
          </Button>
        ))}
        <Button
          variant='ghost'
          size='sm'
          className='invisible group-hover:visible'
          data-id={id} // Set a data attribute
          onClick={handleDelete}
        >
          <Cross1Icon />
        </Button>
      </span>
    </Link>
  )
}
