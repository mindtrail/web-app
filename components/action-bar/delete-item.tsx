import { useCallback, useMemo, useState } from 'react'
import { TrashIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

import { ENTITY_TYPE } from '@/lib/constants'

import { deleteDataSource } from '@/lib/serverActions/dataSource'
import { deleteClipping } from '@/lib/serverActions/clipping'
import { removeDataSourceFromCollection } from '@/lib/serverActions/dataSource'
import { removeTagFromDataSources } from '@/lib/serverActions/tag'

import { DeleteContent } from './delete-content'

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
  table: Table<HistoryItem>
  entityType: EntityType
  entityId?: string
}

const DELETE_TITLE = {
  [ENTITY_TYPE.HIGHLIGHTS]: 'Delete Highlight(s)',
  [ENTITY_TYPE.ALL_ITEMS]: 'Delete Item(s)',
  [ENTITY_TYPE.COLLECTION]: 'Remove from Collection',
  [ENTITY_TYPE.TAG]: 'Remove Tag',
}

const DELETE_FROM_DB_TITLE = 'Delete Everywhere'

export const DeleteItem = ({ entityType, entityId, table }: DeleteItemProps) => {
  const { toast } = useToast()

  const [itemsToDelete, setItemsToDelete] = useState<
    HistoryItem[] | SavedClipping[] | null
  >(null)

  const [deleteEverywhere, setDeleteEverywhere] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onDelete = useCallback(() => {
    const itemsToDelete = table
      .getSelectedRowModel()
      .flatRows.map(({ original }) => original)

    if (!itemsToDelete?.length) {
      console.error('No items selected to delete')
      return
    }

    setItemsToDelete(itemsToDelete)
    setDeleteDialogOpen(true)
  }, [table])

  const confirmDelete = useCallback(async () => {
    try {
      let successMessage

      if (entityType === ENTITY_TYPE.HIGHLIGHTS) {
        successMessage = await deleteHighlights(itemsToDelete as SavedClipping[])
      } else {
        successMessage = await deleteDSItems({
          deleteEverywhere,
          entityType,
          entityId,
          itemsList: itemsToDelete as HistoryItem[],
        })
      }

      toast({ title: 'Success', description: successMessage })
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting`,
      })
      console.error(err)
    } finally {
      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    }
  }, [toast, entityType, entityId, itemsToDelete, deleteEverywhere])

  const actionLabel = useMemo(
    () =>
      entityType === ENTITY_TYPE.HIGHLIGHTS ||
      entityType === ENTITY_TYPE.ALL_ITEMS ||
      deleteEverywhere
        ? 'Delete'
        : 'Remove',
    [entityType, deleteEverywhere],
  )

  return (
    <>
      <Button
        variant='ghost'
        size='sm'
        className='flex gap-1 group/delete hover:text-destructive'
        onClick={onDelete}
      >
        <TrashIcon className='shrink-0 w-5 h-5 group-hover/delete:text-destructive' />
        {actionLabel}
      </Button>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent content=''>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteEverywhere ? DELETE_FROM_DB_TITLE : DELETE_TITLE[entityType]}
            </AlertDialogTitle>
            <AlertDialogDescription className='flex flex-col cursor-default gap-2'>
              <DeleteContent
                entityType={entityType}
                itemsToDelete={itemsToDelete}
                deleteEverywhere={deleteEverywhere}
                setDeleteEverywhere={setDeleteEverywhere}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='max-w-l'>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={confirmDelete}>
              {actionLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Define a function for each delete operation
const deleteHighlights = async (itemsList: SavedClipping[]) => {
  const clippingIdList = itemsList.map(({ id }) => id)

  await deleteClipping({ clippingIdList })
  return `Deleted ${itemsList.length} highlight(s).`
}

type deleteDSItemsProps = {
  itemsList: HistoryItem[]
  deleteEverywhere: boolean
  entityType: EntityType
  entityId?: string
}

const deleteDSItems = async (props: deleteDSItemsProps) => {
  const { itemsList, deleteEverywhere, entityType, entityId } = props
  const dataSourceIdList = itemsList.map(({ id }) => id)

  // For all items, or from Highlights page that want permanent delete too...
  if (deleteEverywhere) {
    await deleteDataSource({ dataSourceIdList })
    return `Deleted ${dataSourceIdList.length} item(s) from everywhere.`
  }

  // For all items, or from Collections or Tags page that want permanent delete too...
  if (entityType === ENTITY_TYPE.ALL_ITEMS) {
    await deleteDataSource({ dataSourceIdList })
    return `${itemsList.map(({ displayName = '' }) => displayName).join(', ')} have been deleted`
  }

  if (!entityId) {
    throw new Error('No entityId provided')
  }

  if (entityType === ENTITY_TYPE.COLLECTION) {
    await removeDataSourceFromCollection({ id: entityId, dataSourceIdList })
    return `${itemsList.length} item(s) have been removed from collection`
  }

  if (entityType === ENTITY_TYPE.TAG) {
    await removeTagFromDataSources({ id: entityId, dataSourceIdList })
    return `${itemsList.length} item(s) have had tag removed`
  }
}
