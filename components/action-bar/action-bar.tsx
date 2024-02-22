import { useCallback, useState } from 'react'
import { DataSourceType } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { IconTag, IconAddToFolder } from '@/components/ui/icons/next-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'

import { AddToCollectionOrTag } from '@/components/action-bar/add-to-collection-or-tag'

import { ENTITY_TYPE } from '@/lib/constants'
import { cn, getURLPathname } from '@/lib/utils'
import { deleteDataSource } from '@/lib/serverActions/dataSource'

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

type ActionBarProps = {
  table: Table<HistoryItem>
  dataType?: string
}

const actionBarBtnStyle = cn(
  'flex items-center gap-1',
  buttonVariants({ variant: 'ghost', size: 'sm' }),
)

export const ActionBar = ({ table }: ActionBarProps) => {
  const { toast } = useToast()

  const [addToFolderVisibility, setAddToFolderVisibility] = useState(false)
  const [addTagsOpen, setAddTagsOpen] = useState(false)

  const [itemsToDelete, setItemsToDelete] = useState<HistoryItem[] | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onDelete = useCallback(() => {
    const selectedRows = table.getSelectedRowModel()
    // @ts-ignore
    const itemsToDelete = selectedRows.rows.map(({ original }) => original as HistoryItem)
    if (!itemsToDelete?.length) {
      return
    }

    setItemsToDelete(itemsToDelete)
    setDeleteDialogOpen(true)
  }, [table])

  const confirmHistoryDelete = useCallback(async () => {
    if (!itemsToDelete?.length) {
      return
    }

    const deletedItems = itemsToDelete
      .map(({ displayName = '' }) => displayName)
      .join(', ')

    const dataSourceIdList = itemsToDelete.map(({ id }) => id)

    try {
      await deleteDataSource({ dataSourceIdList })
      toast({
        title: 'Delete History Entry',
        description: `${deletedItems} has been deleted`,
      })

      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${deletedItems}`,
      })
      console.log(err)

      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    }
  }, [itemsToDelete, toast])

  return (
    <>
      <div
        className={`absolute w-full h-12 bg-background border-b shadow-sm
          flex items-center first-letter:top-0 px-4 z-20 gap-4 rounded-t-md`}
      >
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
        <div className='flex flex-1 items-center ml-1 gap-2'>
          <Popover open={addToFolderVisibility} onOpenChange={setAddToFolderVisibility}>
            <PopoverTrigger className={actionBarBtnStyle}>
              <IconAddToFolder className='shrink-0 w-5 h-5' />
              Folders
            </PopoverTrigger>
            <PopoverContent className='w-64' align='start'>
              <AddToCollectionOrTag
                table={table}
                destintaionEntity={ENTITY_TYPE.COLLECTION}
              />
            </PopoverContent>
          </Popover>
          <Popover open={addTagsOpen} onOpenChange={setAddTagsOpen}>
            <PopoverTrigger className={actionBarBtnStyle}>
              <IconTag className='shrink-0 w-5 h-5' />
              Tags
            </PopoverTrigger>
            <PopoverContent className='w-64' align='start'>
              <AddToCollectionOrTag table={table} destintaionEntity={ENTITY_TYPE.TAG} />
            </PopoverContent>
          </Popover>

          <Button
            variant='ghost'
            size='sm'
            className='flex gap-1 group/delete hover:text-destructive'
            onClick={onDelete}
          >
            <TrashIcon className='shrink-0 w-5 h-5 group-hover/delete:text-destructive' />
            Delete
          </Button>
        </div>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent content=''>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription className='flex flex-col cursor-default'>
              <span>This will delete the history entries and the associated data.</span>
              <span>
                The action cannot be undone and will <strong>permanently delete: </strong>
              </span>

              <ScrollArea className='py-2 max-h-[25vh]'>
                <ul
                  className='flex flex-col items-start mt-4 mb-2 gap-2 pl-4 sm:px-2
                  max-w-[80vw] xs:max-w-[70vw] sm:max-w-md list-disc list-inside'
                >
                  {itemsToDelete?.map(({ displayName = '', name, type }, index) => (
                    <li key={index} className='truncate max-w-full'>
                      {type === DataSourceType.file
                        ? displayName
                        : displayName + getURLPathname(name)}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='max-w-l'>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={confirmHistoryDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
