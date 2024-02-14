import { useCallback, useState, useMemo } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconFolder, IconAddToFolder } from '@/components/ui/icons/next-icons'

import { useToast } from '@/components/ui/use-toast'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'

import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'
import { createCollection } from '@/lib/serverActions/collection'
import { addDataSourcesToCollection } from '@/lib/serverActions/dataSource'

type AddToFolderProps = {
  currentFolderId?: string
  table: Table<HistoryItem>
  setAddToFolderVisibility: (value: boolean) => void
}

const ENTITY_TYPE = 'folder'
const transitionStyle = 'transition-opacity duration-200 ease-in-out'

export function AddToFolder(props: AddToFolderProps) {
  const { currentFolderId, table, setAddToFolderVisibility } = props

  const { toast } = useToast()

  const [{ nestedItemsByCategory }] = useGlobalState()
  const { setNestedItemsByCategory, setActiveNestedSidebar } = useGlobalStateActions()

  const [searchValue, setSearchValue] = useState('')

  const allFolders = useMemo(
    () => nestedItemsByCategory.folder,
    [nestedItemsByCategory.folder],
  )

  const filteredItems = useMemo(
    () =>
      allFolders
        .filter(({ id }) => id != currentFolderId)
        .map(({ id, name }) => ({ value: id, label: name })),
    [allFolders, currentFolderId],
  )

  const onAddToFolder = useCallback(
    async (payload: AddItemToFolder) => {
      const { existingFolderId, newFolderName } = payload

      let collectionId = existingFolderId

      if (newFolderName) {
        try {
          const newCollection = await createCollection({ name: newFolderName })

          // @TODO: improve this
          if ('id' in newCollection) {
            const { id: newCollectionId } = newCollection

            collectionId = newCollectionId
            const newItem = {
              id: newCollectionId,
              name: newFolderName,
              url: `/folder/${newCollectionId}`,
            }

            const newItemList = [newItem, ...allFolders]
            setNestedItemsByCategory({ entityType: ENTITY_TYPE, items: newItemList })
          }
        } catch (error) {
          console.log(error)
        }
      }

      if (!collectionId) {
        return console.log(' No collection ID found')
      }

      const seledItemListIds = table
        .getSelectedRowModel()
        .rows.map(({ original }) => original.id)

      const result = await addDataSourcesToCollection(seledItemListIds, collectionId)

      // @ts-ignore
      const { error, count: nrOfitemsAdded } = result

      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'No Items added to folder',
        })
        return console.log('No result')
      }

      const nrOfSelected = seledItemListIds?.length
      const nrOfItemsAlreadyExisting = nrOfSelected - nrOfitemsAdded

      toast({
        title: 'Success',
        description: `Added: ${nrOfitemsAdded} item(s).
        ${nrOfItemsAlreadyExisting ? `Existing: ${nrOfItemsAlreadyExisting} item(s).` : ''}`,
      })

      setAddToFolderVisibility(false)
      // table.resetRowSelection()

      // @TODO: TBD if I keep this operation
      setActiveNestedSidebar(SIDEBAR_FOLDERS[ENTITY_TYPE])
      // @TODO: Create an animation for the selected folder
      // animation...
    },
    [
      table,
      allFolders,
      toast,
      setNestedItemsByCategory,
      setActiveNestedSidebar,
      setAddToFolderVisibility,
    ],
  )

  return (
    // @ts-ignore
    <Command onChange={(e) => setSearchValue(e.target?.value)}>
      <CommandInput placeholder='Type to search or create...' />
      <CommandEmpty className='py-4'>
        <Button
          className='flex items-center gap-2 px-3 w-full justify-start'
          variant='ghost'
          onClick={() => onAddToFolder({ newFolderName: searchValue })}
        >
          <PlusIcon className='shrink-0' />
          <span className='max-w-44 truncate'>
            Add to <strong>{searchValue}</strong>
          </span>
        </Button>
      </CommandEmpty>
      <ScrollArea className='flex flex-col max-h-[40vh]'>
        <CommandGroup className='px-0'>
          {filteredItems.map(({ value, label }, index) => (
            <CommandItem
              key={index}
              className='flex gap-2 cursor-default group'
              onSelect={() => onAddToFolder({ existingFolderId: value })}
            >
              <span className='w-4 h-4 relative'>
                <IconFolder
                  className={`${transitionStyle} absolute
                    group-data-[selected=true]:opacity-0 `}
                />
                <IconAddToFolder
                  className={`${transitionStyle} absolute opacity-0
                    group-data-[selected=true]:opacity-100`}
                />
              </span>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  )
}
