import { useCallback, useEffect, useState, useMemo } from 'react'
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconFolder } from '@/components/ui/icons/next-icons'

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
import {
  addDataSourcesToCollection,
  getCollectionsForDataSourceList,
  removeDataSourceFromCollection,
} from '@/lib/serverActions/dataSource'

type AddToFolderProps = {
  currentFolderId?: string
  table: Table<HistoryItem>
  setAddToFolderVisibility: (value: boolean) => void
}

const ENTITY_TYPE = 'folder'

export function AddToFolder(props: AddToFolderProps) {
  const { currentFolderId, table, setAddToFolderVisibility } = props

  const { toast } = useToast()
  const [{ nestedItemsByCategory }] = useGlobalState()
  const { setNestedItemsByCategory, setActiveNestedSidebar } = useGlobalStateActions()

  const itemsToAdd = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => original.id),
    [table],
  )
  const [searchValue, setSearchValue] = useState('')

  const [foldersContainingSelectedDS, setFoldersContainingSelectedDS] = useState<
    string[]
  >([])

  useEffect(() => {
    const getCollectionsForSelectedDS = async () => {
      const folders = await getCollectionsForDataSourceList(itemsToAdd)

      setFoldersContainingSelectedDS(folders)
    }

    // A small delay to don't block the UI when first loading the component
    setTimeout(() => {
      getCollectionsForSelectedDS()
    }, 400)
  }, [itemsToAdd])

  const allFolders = useMemo(
    () => nestedItemsByCategory.folder,
    [nestedItemsByCategory.folder],
  )

  const filteredItems = useMemo(
    () => allFolders.map(({ id, name }) => ({ value: id, label: name })),
    [allFolders],
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

      if (foldersContainingSelectedDS.includes(collectionId)) {
        // @TODO: remove them from that folder
        removeDataSourceFromCollection({ collectionId, dataSourceIdList: itemsToAdd })
        setFoldersContainingSelectedDS((prev) => prev.filter((id) => id != collectionId))
        return
      }

      const result = await addDataSourcesToCollection(itemsToAdd, collectionId)
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

      const nrOfSelected = itemsToAdd?.length
      const nrOfItemsAlreadyExisting = nrOfSelected - nrOfitemsAdded

      toast({
        title: 'Success',
        description: `Added: ${nrOfitemsAdded} item(s).
        ${nrOfItemsAlreadyExisting ? `Existing: ${nrOfItemsAlreadyExisting} item(s).` : ''}`,
      })

      // setAddToFolderVisibility(false)
      // table.resetRowSelection()
      setFoldersContainingSelectedDS((prev) => [...prev, collectionId])

      // @TODO: TBD if I keep this operation
      setActiveNestedSidebar(SIDEBAR_FOLDERS[ENTITY_TYPE])
      // @TODO: Create an animation for the selected folder
      // animation...
    },
    [
      allFolders,
      itemsToAdd,
      foldersContainingSelectedDS,
      toast,
      setNestedItemsByCategory,
      setActiveNestedSidebar,
      setFoldersContainingSelectedDS,
      // setAddToFolderVisibility,
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
              <IconFolder />
              {label}
              {/* check if the folderId, meaning the value, is in the foldersContainingSelectedDS  array*/}
              {foldersContainingSelectedDS.includes(value) && (
                <CheckIcon className='absolute right-4' />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  )
}
