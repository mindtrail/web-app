import { MouseEvent } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { HistoryEntry } from '@/components/history/entry'

interface HistoryTableProps {
  items: HistoryItem[]
  filters?: HistoryFilter[]
  handleTagListClick: (event: MouseEvent<HTMLButtonElement>) => void
  handleHistoryDelete: (
    event: MouseEvent<HTMLButtonElement>,
    historyItem: HistoryItem,
  ) => void
}

export function HistoryTable(props: HistoryTableProps) {
  const { items, filters, handleTagListClick, handleHistoryDelete } = props

  if (!items?.length) {
    return
  }

  return (
    <ScrollArea className='flex max-h-[86vh] min-w-0 flex-1 flex-col gap-2 rounded-md py-2 '>
      <div className='grid cursor-default gap-2'>
        <div className='flex w-full justify-around'>
          <div>Website</div>
          <div>Description</div>
          <div>Tags</div>
          <div>Actions</div>
        </div>
        {items.map((historyItem, index) => (
          <HistoryEntry
            key={index}
            historyItem={historyItem}
            filters={filters}
            handleTagListClick={handleTagListClick}
            handleHistoryDelete={handleHistoryDelete}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
