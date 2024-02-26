import { DataSourceType } from '@prisma/client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { ENTITY_TYPE } from '@/lib/constants'
import { getURLPathname } from '@/lib/utils'

type DeleteContentProps = {
  entityType: EntityType
  itemsToDelete: HistoryItem[] | SavedClipping[] | null
  deleteEverywhere?: boolean
  setDeleteEverywhere: (value: boolean) => void
}

export const DeleteContent = (props: DeleteContentProps) => {
  let { entityType, itemsToDelete, deleteEverywhere, setDeleteEverywhere } = props

  if (!itemsToDelete?.length) {
    return null
  }

  let itemsList

  if (entityType === ENTITY_TYPE.HIGHLIGHTS) {
    itemsToDelete = itemsToDelete as SavedClipping[]

    itemsList = (
      <>
        {itemsToDelete?.map(({ content }, index) => (
          <span key={index} className='truncate max-w-full list-item shrink-0'>
            {content}
          </span>
        ))}
      </>
    )
  } else {
    itemsToDelete = itemsToDelete as HistoryItem[]

    itemsList = (
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

  const deleteFromDBMessage = (
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

  const removeFromColOrTagMessage = (
    <>
      <span>
        {entityType === ENTITY_TYPE.COLLECTION
          ? 'Remove selected Item(s) from Collection.'
          : 'Remove Tag from the selected item(s).'}
      </span>
      <span>You can still find them in All-Items.</span>
    </>
  )

  const deleteEverywhereMessage = (
    <>
      <span>
        Delete Item(s) from database. <strong>Cannot be reversed.</strong>
      </span>
      <span>
        It will <strong>permanently delete:</strong>
      </span>{' '}
    </>
  )

  const infoMessage = deleteEverywhere
    ? deleteEverywhereMessage
    : entityType === ENTITY_TYPE.HIGHLIGHTS || entityType === ENTITY_TYPE.ALL_ITEMS
      ? deleteFromDBMessage
      : removeFromColOrTagMessage

  return (
    <>
      {infoMessage}

      <span className='flex items-center gap-2 mt-4'>
        <Switch
          id='delete-from-db'
          name='delete-from-db'
          checked={deleteEverywhere}
          onCheckedChange={() => setDeleteEverywhere(!deleteEverywhere)}
        />
        <Label htmlFor='delete-from-db'>Delete Everywhere</Label>
      </span>

      <span
        className='flex flex-col items-start mt-2 mb-2 gap-2 pl-4 sm:px-2
          py-2 max-h-[25vh] overflow-y-auto
          max-w-[80vw] xs:max-w-[70vw] sm:max-w-md list-disc list-inside'
      >
        {itemsList}
      </span>
    </>
  )
}
