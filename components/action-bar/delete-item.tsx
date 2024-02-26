import { useCallback, useState } from 'react'
import { DataSourceType } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { ENTITY_TYPE } from '@/lib/constants'
import { cn, getURLPathname } from '@/lib/utils'
import { deleteDataSource } from '@/lib/serverActions/dataSource'
import { deleteClipping } from '@/lib/serverActions/clipping'

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

type DeleteItemProps = {
  entityType: EntityType
  table: Table<HistoryItem>
}

const DELETE_TITLE = {
  [ENTITY_TYPE.HIGHLIGHTS]: 'Delete Highlight(s)',
  [ENTITY_TYPE.ALL_ITEMS]: 'Delete Item(s)',
  [ENTITY_TYPE.COLLECTION]: 'Remove Item(s) from Collection',
  [ENTITY_TYPE.TAG]: 'Remove Tag from Item(s)',
}

export const DeleteItem = ({ entityType, table }: DeleteItemProps) => {
  const { toast } = useToast()

  const [itemsToDelete, setItemsToDelete] = useState<
    HistoryItem[] | SavedClipping[] | null
  >(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  console.log(entityType)

  const bodyMessage = getDeleteMessage(entityType)

  const onDelete = useCallback(() => {
    const selectedRows = table.getSelectedRowModel()
    console.log(selectedRows)

    const itemsToDelete = selectedRows.flatRows.map(({ original }) => original)

    if (!itemsToDelete?.length) {
      console.error('No items selected to delete')
      return
    }

    setItemsToDelete(itemsToDelete)
    setDeleteDialogOpen(true)
  }, [table])

  const confirmDelete = useCallback(async () => {
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
      <Button
        variant='ghost'
        size='sm'
        className='flex gap-1 group/delete hover:text-destructive'
        onClick={onDelete}
      >
        <TrashIcon className='shrink-0 w-5 h-5 group-hover/delete:text-destructive' />
        Delete
      </Button>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent content=''>
          <AlertDialogHeader>
            <AlertDialogTitle>{DELETE_TITLE[entityType]}</AlertDialogTitle>
            <AlertDialogDescription className='flex flex-col cursor-default gap-2'>
              {bodyMessage}

              <span
                className='flex flex-col items-start mt-2 mb-2 gap-2 pl-4 sm:px-2
                  py-2 max-h-[25vh] overflow-y-auto
                  max-w-[80vw] xs:max-w-[70vw] sm:max-w-md list-disc list-inside'
              >
                {itemsToDelete?.map(({ displayName = '', name, type }, index) => (
                  <span key={index} className='truncate max-w-full list-item shrink-0'>
                    {type === DataSourceType.file
                      ? displayName
                      : displayName + getURLPathname(name)}
                  </span>
                ))}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='max-w-l'>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const getDeleteMessage = (entityType: EntityType) => (
  <>
    <span>
      Delete {entityType === ENTITY_TYPE.HIGHLIGHTS ? 'Highlight(s)' : 'Item(s)'} and
      associated data. <strong>Cannot be reversed.</strong>
    </span>
    <span>
      It will <strong>permanently delete:</strong>
    </span>
  </>
)
