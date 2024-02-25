import { useCallback, useState } from 'react'
import { DataSourceType } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

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
export const DeleteItem = ({ entityType, table }: DeleteItemProps) => {
  const { toast } = useToast()

  const [itemsToDelete, setItemsToDelete] = useState<HistoryItem[] | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onDelete = useCallback(() => {
    const selectedRows = table.getSelectedRowModel()
    console.log(selectedRows)

    const itemsToDelete = selectedRows.flatRows.map(
      ({ original }) => original as HistoryItem,
    )

    if (!itemsToDelete?.length) {
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
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription className='flex flex-col cursor-default'>
              <span>This will delete the history entries and the associated data.</span>
              <span>
                The action cannot be undone and will <strong>permanently delete: </strong>
              </span>

              <span
                className='flex flex-col items-start mt-4 mb-2 gap-2 pl-4 sm:px-2
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
