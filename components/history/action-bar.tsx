import { useCallback, useState } from 'react'
import { TrashIcon } from '@radix-ui/react-icons'
import { Table as ReactTable } from '@tanstack/react-table'

import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { IconTag, IconFolder } from '@/components/ui/icons/next-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'

import { AddToFolder } from '@/components/history/add-to-folder'

import { cn } from '@/lib/utils'
import { createCollection } from '@/lib/serverActions/collection'
import { useGlobalState, useGlobalStateActions } from '@/context/global-state'

import { addDataSourcesToCollection } from '@/lib/serverActions/dataSource'

type ActionBarProps = {
  table: ReactTable<HistoryItem>
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

  const [addToFolderOpen, setAddToFolderOpen] = useState(false)
  const [addTagsOpen, setAddTagsOpen] = useState(false)

  const { toast } = useToast()
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
      const { existingFolderId, newFolderName } = payload

      let collectionId = existingFolderId

      if (newFolderName) {
        try {
          const response = await createCollection({
            name: newFolderName,
            userId: '',
            description: '',
          })

          // @TODO: improve this
          if ('id' in response && 'name' in response && 'description' in response) {
            const { id, name, description } = response

            const newItem = {
              id,
              name,
              description,
              url: `/folder/${response.id}`,
            }

            collectionId = id
            const newItemList = [newItem, ...nestedItemsByCategory.folder]

            setNestedItemsByCategory({
              entityType: FOLDER_ENTITY,
              items: newItemList,
            })
          }
        } catch (error) {
          console.log(error)
        }
      }

      if (!collectionId) {
        return console.log(' No collection ID found')
      }

      const dataSourceIds = table
        .getSelectedRowModel() // @ts-ignore
        .rows.map(({ original }) => original.id)

      const result = await addDataSourcesToCollection(dataSourceIds, collectionId)

      console.log(result)
      // @ts-ignore
      if (result?.error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'No Items added to folder',
        })
        return console.log('No result')
      }

      // @ts-ignore
      const nrOfitemsAdded = result?.count
      const nrOfSelected = dataSourceIds?.length
      const nrOfExisting = nrOfSelected - nrOfitemsAdded

      toast({
        title: 'Success',
        description: `Added: ${nrOfitemsAdded} item(s).
        ${nrOfExisting ? `Existing: ${nrOfExisting} item(s).` : ''}`,
      })

      setAddToFolderOpen(false)
      table.resetRowSelection()

      // @TODO: show a toast, close the popup, and unselect the items
    },
    [table, nestedItemsByCategory.folder, setNestedItemsByCategory, toast],
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
        <Popover open={addToFolderOpen} onOpenChange={setAddToFolderOpen}>
          <PopoverTrigger className={actionBarBtnStyle}>
            <IconFolder className='shrink-0' />
            Add to Folder
          </PopoverTrigger>
          <PopoverContent className='w-64' align='start'>
            <AddToFolder onAddToFolder={onAddToFolder} />
          </PopoverContent>
        </Popover>
        <Popover open={addTagsOpen} onOpenChange={setAddTagsOpen}>
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
