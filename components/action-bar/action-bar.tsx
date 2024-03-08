import { useState } from 'react'
import { Table } from '@tanstack/react-table'

import { buttonVariants } from '@/components/ui/button'
import { CheckboxWithLabel } from '@/components/ui/checkbox-large'
import { IconTag, IconAddToCollection } from '@/components/ui/icons/next-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { AddToCollectionOrTag } from './add-to-collection-or-tag'
import { DeleteItem } from './delete-item'

import { ENTITY_TYPE } from '@/lib/constants'
import { cn } from '@/lib/utils'

type ActionBarProps = {
  table: Table<HistoryItem>
  entityType: string
  entityId?: string
  className?: string
}

const actionBarBtnStyle = cn(
  'flex items-center gap-1',
  buttonVariants({ variant: 'ghost', size: 'sm' }),
)

export const ActionBar = ({ table, entityType, entityId, className }: ActionBarProps) => {
  const [addToFolderVisibility, setAddToFolderVisibility] = useState(false)
  const [addTagsVisibility, setAddTagsVisibility] = useState(false)

  const checkBoxStatus = table.getIsAllPageRowsSelected()
    ? true
    : table.getIsSomePageRowsSelected()
      ? 'indeterminate'
      : false

  return (
    <div
      className={cn(
        `w-full flex items-center h-12 bg-background first-letter:top-0 pl-12 pr-4 rounded-t-md`,
        className,
      )}
    >
      <CheckboxWithLabel
        className='absolute left-0'
        checked={checkBoxStatus}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
      <div className='flex flex-1 items-center ml-1 gap-2'>
        {entityType !== ENTITY_TYPE.HIGHLIGHTS && (
          <>
            <Popover open={addToFolderVisibility} onOpenChange={setAddToFolderVisibility}>
              <PopoverTrigger className={actionBarBtnStyle}>
                <IconAddToCollection className='shrink-0 w-5 h-5' />
                Collections
              </PopoverTrigger>
              <PopoverContent className='w-64' align='start'>
                <AddToCollectionOrTag
                  table={table}
                  destintaionEntity={ENTITY_TYPE.COLLECTION}
                />
              </PopoverContent>
            </Popover>
            <Popover open={addTagsVisibility} onOpenChange={setAddTagsVisibility}>
              <PopoverTrigger className={actionBarBtnStyle}>
                <IconTag className='shrink-0 w-5 h-5' />
                Tags
              </PopoverTrigger>
              <PopoverContent className='w-64' align='start'>
                <AddToCollectionOrTag table={table} destintaionEntity={ENTITY_TYPE.TAG} />
              </PopoverContent>
            </Popover>
          </>
        )}
        <DeleteItem table={table} entityType={entityType} entityId={entityId} />
      </div>
    </div>
  )
}
