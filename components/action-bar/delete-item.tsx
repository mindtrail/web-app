import { useCallback, useState } from 'react'
import { DataSourceType } from '@prisma/client'
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

type DeleteActionProps = {
  entityType: EntityType
  entityId?: string
  itemsToDelete: HistoryItem[] | SavedClipping[]
  deleteEverywhere?: boolean
}

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
    if (!itemsToDelete?.length) {
      return
    }

    try {
      const confirmMessage = await performDeleteOp({
        entityType,
        itemsToDelete,
        entityId,
      })

      toast({ ...confirmMessage })
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting`,
      })
      console.log(err)
    } finally {
      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    }
  }, [itemsToDelete, entityType, entityId, toast])

  const performDeleteOp = async (props: DeleteActionProps) => {
    let { entityType, entityId, itemsToDelete, deleteEverywhere } = props

    if (entityType === ENTITY_TYPE.HIGHLIGHTS) {
      itemsToDelete = itemsToDelete as SavedClipping[]
      const payload = {
        clippingIdList: itemsToDelete.map(({ id }) => id),
      }

      await deleteClipping(payload)
      return {
        title: 'Delete Highlights',
        description: `${itemsToDelete.length} clipping(s) have been deleted`,
      }
    }

    itemsToDelete = itemsToDelete as HistoryItem[]
    const dataSourceIdList = itemsToDelete.map(({ id }) => id)

    // For all items, or from Collections or Tags page that want permanent delete too...
    if (entityType === ENTITY_TYPE.ALL_ITEMS || deleteEverywhere) {
      await deleteDataSource({ dataSourceIdList })
      return {
        title: 'Delete Item(s)',
        description: `
        ${itemsToDelete.map(({ displayName = '' }) => displayName).join(', ')}
        have been deleted`,
      }
    }

    if (!entityId) {
      throw new Error('No entityId provided')
    }

    if (entityType === ENTITY_TYPE.COLLECTION) {
      await removeDataSourceFromCollection({
        id: entityId,
        dataSourceIdList,
      })

      return {
        title: 'Removed from Collection',
        description: `${itemsToDelete.length} item(s) have been removed from collection`,
      }
    }

    if (entityType === ENTITY_TYPE.TAG) {
      await removeTagFromDataSources({
        id: entityId,
        dataSourceIdList,
      })

      return {
        title: 'Tag Removed',
        description: `${itemsToDelete.length} item(s) have had tag removed`,
      }
    }
  }

  const actionLabel =
    entityType === ENTITY_TYPE.HIGHLIGHTS ||
    entityType === ENTITY_TYPE.ALL_ITEMS ||
    deleteEverywhere
      ? 'Delete'
      : 'Remove'

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
