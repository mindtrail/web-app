import { MouseEvent, useMemo } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { HistoryEntry } from '@/components/history/entry'

interface HistoryTableProps {
  items: HistoryItem[]
  filters?: HistoryFilter[]
  columns: HistoryFilter[]
  handleTagListClick: (event: MouseEvent<HTMLButtonElement>) => void
  handleHistoryDelete: (
    event: MouseEvent<HTMLButtonElement>,
    historyItem: HistoryItem,
  ) => void
}

export function HistoryTable(props: HistoryTableProps) {
  const { items, filters, columns, handleTagListClick, handleHistoryDelete } =
    props

  const gridStyle = useMemo(() => {
    return `grid grid-cols-${columns.length} cursor-default px-4 gap-2 lg:gap-4`
  }, [columns])

  if (!items?.length) {
    return
  }

  return (
    <ScrollArea className='flex max-h-[86vh] min-w-0 flex-1 flex-col gap-2 rounded-md py-2 '>
      <div className={gridStyle}>
        {columns.map((column, index) => (
          <div className='flex justify-center' key={index}>
            {column?.label}
          </div>
        ))}
      </div>

      {items.map((historyItem, index) => (
        <HistoryEntry
          key={index}
          historyItem={historyItem}
          columns={columns}
          filters={filters}
          gridStyle={gridStyle}
          handleTagListClick={handleTagListClick}
          handleHistoryDelete={handleHistoryDelete}
        />
      ))}
    </ScrollArea>
  )
}
