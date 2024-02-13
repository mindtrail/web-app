import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { TrashIcon } from '@radix-ui/react-icons'
import { IconTag, IconFolder } from '@/components/ui/icons/next-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { AddToFolder } from '@/components/history/add-to-folder'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'
import { createCollection } from '@/lib/serverActions/collection'

type ActionBarProps = {
  table: any
  areRowsSelected: boolean
  handleHistoryDelete: (ids: HistoryItem[]) => void
}

const actionBarBtnStyle = cn(
  'flex items-center gap-1',
  buttonVariants({ variant: 'ghost', size: 'sm' }),
)

const FOLDER_ENTITY = 'folder'

export const ActionBar = (props: ActionBarProps) => {
  const { areRowsSelected, table, handleHistoryDelete } = props

  const { setNestedItemsByCategory } = useGlobalStateActions()
  const [state] = useGlobalState()
  const { nestedItemsByCategory } = state

  const onDelete = useCallback(() => {
    const selectedRows = table.getSelectedRowModel()
    // @ts-ignore
    const itemsToDelete = selectedRows.rows.map(({ original }) => original as HistoryItem)

    handleHistoryDelete(itemsToDelete)
  }, [handleHistoryDelete, table])

  const onAddToFolder = useCallback(
    async (payload: AddItemToFolder) => {
      const { existingId, newFolderName } = payload

      const selectedRows = table.getSelectedRowModel()

      if (existingId) {
        console.log(existingId)
        console.log(selectedRows)
        return
      }

      if (newFolderName) {
        console.log(newFolderName)
        console.log(selectedRows)
        try {
          const response = await createCollection({
            name: newFolderName,
            userId: '',
            description: '',
          })

          console.log(newFolderName)
          // @TODO: improve this
          if ('id' in response && 'name' in response && 'description' in response) {
            const { id, name, description } = response
            const newItem = {
              id,
              name,
              description,
              url: `/folder/${response.id}`,
            }

            const newItemList = [newItem, ...nestedItemsByCategory.folder]

            return setNestedItemsByCategory({
              entityType: FOLDER_ENTITY,
              items: newItemList,
            })
          }

          console.error('Error creating item:', response)
        } catch (error) {
          console.log(error)
        }
      }
    },
    [table, nestedItemsByCategory.folder, setNestedItemsByCategory],
  )

  return (
    <div
      className={`absolute invisible w-full h-10 bg-background border-b shadow-sm
    flex items-center first-letter:top-0 px-4 z-20 gap-4 rounded-t-md
    ${areRowsSelected && '!visible'}`}
    >
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
      <div className='flex items-center gap-4 ml-2'>
        <Popover>
          <PopoverTrigger className={actionBarBtnStyle}>
            <IconFolder className='shrink-0' />
            Add to Folder
          </PopoverTrigger>
          <PopoverContent className='w-64' align='start'>
            <AddToFolder onAddToFolder={onAddToFolder} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className={actionBarBtnStyle}>
            <IconTag className='shrink-0' />
            Add Tags
          </PopoverTrigger>
          <PopoverContent className='w-64' align='start'>
            Tags
          </PopoverContent>
        </Popover>

        <Button
          variant='ghost'
          size='sm'
          className='gap-1 flex hover:text-destructive'
          onClick={onDelete}
        >
          <TrashIcon width={16} height={16} />
          Delete
        </Button>
      </div>
    </div>
  )
}
