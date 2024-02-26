import { useCallback, useState } from 'react'
import { DataSourceType } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { ENTITY_TYPE } from '@/lib/constants'
import { getURLPathname } from '@/lib/utils'

import { deleteDataSource } from '@/lib/serverActions/dataSource'
import { deleteClipping } from '@/lib/serverActions/clipping'
import { removeDataSourceFromCollection } from '@/lib/serverActions/dataSource'
import { removeTagFromDataSources } from '@/lib/serverActions/tag'

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

export const DeleteItem = ({ entityType, entityId, table }: DeleteItemProps) => {
  const { toast } = useToast()

  const [itemsToDelete, setItemsToDelete] = useState<
    HistoryItem[] | SavedClipping[] | null
  >(null)

  const [deleteDSFromDb, setDeleteDSFromDb] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const bodyMessage = getDeleteMessage(entityType)

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
                {getDeleteModalContent({ entityType, itemsToDelete })}
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

type DeleteContentProps = {
  entityType: EntityType
  itemsToDelete: HistoryItem[] | SavedClipping[] | null
}

const getDeleteModalContent = ({ entityType, itemsToDelete }: DeleteContentProps) => {
  if (!itemsToDelete?.length) {
    return null
  }

  if (entityType === ENTITY_TYPE.HIGHLIGHTS) {
    itemsToDelete = itemsToDelete as SavedClipping[]

    return (
      <>
        {itemsToDelete?.map(({ content }, index) => (
          <span key={index} className='truncate max-w-full list-item shrink-0'>
            {content}
          </span>
        ))}
      </>
    )
  }

  itemsToDelete = itemsToDelete as HistoryItem[]

  return (
    <>
      {itemsToDelete?.map(({ displayName = '', name, type }, index) => (
        <span key={index} className='truncate max-w-full list-item shrink-0'>
          {type === DataSourceType.file
            ? displayName
            : displayName + getURLPathname(name)}
        </span>
      ))}
    </>
  )
}

type DeleteActionProps = {
  entityType: EntityType
  entityId?: string
  itemsToDelete: HistoryItem[] | SavedClipping[]
  deleteDSFromDb?: boolean
}

const performDeleteOp = async (props: DeleteActionProps) => {
  let { entityType, entityId, itemsToDelete, deleteDSFromDb } = props

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
  if (entityType === ENTITY_TYPE.ALL_ITEMS || deleteDSFromDb) {
    await deleteDataSource({ dataSourceIdList })
    return {
      title: 'Delete History Item(s)',
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
