import { useCallback, useEffect, useState, useMemo } from 'react'
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconFolder } from '@/components/ui/icons/next-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { Typography } from '@/components/typography'

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
import { Separator } from '../ui/separator'

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
      const folders = (await getCollectionsForDataSourceList(itemsToAdd)) as string[]

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
    () =>
      allFolders?.map(({ id, name }) => ({
        value: id,
        label: name,
        containsSelectedItems: foldersContainingSelectedDS?.includes(id),
      })),
    [allFolders, foldersContainingSelectedDS],
  )

  console.log(foldersContainingSelectedDS)
  console.log(filteredItems)

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

      setFoldersContainingSelectedDS((prev: string[]) =>
        collectionId ? [...prev, collectionId] : prev,
      )

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
    <div className='flex flex-col gap-2'>
      <Typography variant='strong'>Folders</Typography>
      <Typography variant='small' className='text-muted-foreground'>
        Add selected items to folders
      </Typography>

      <Command
        className='-ml-4 mt-1 w-[254px] overflow-auto'
        // @ts-ignore
        onChange={(e) => setSearchValue(e.target?.value)}
      >
        <div className='px-4 py-2'>
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
        </div>
        {filteredItems && (
          <ScrollArea className='flex flex-col max-h-[40vh] px-4'>
            <CommandGroup className='px-0'>
              {filteredItems.map(({ value, label, containsSelectedItems }, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger className='flex w-full relative'>
                    <CommandItem
                      className={`flex flex-1 gap-2
                      ${containsSelectedItems && 'text-primary data-[selected=true]:text-primary'}`}
                      onSelect={() => onAddToFolder({ existingFolderId: value })}
                    >
                      {containsSelectedItems ? (
                        <CheckIcon className='w-4 h-4' />
                      ) : (
                        <IconFolder />
                      )}
                      {label}
                      <TooltipContent
                        side='right'
                        sideOffset={-32}
                        className={
                          containsSelectedItems ? 'bg-destructive text-white' : ''
                        }
                      >
                        {containsSelectedItems ? 'Remove from' : 'Add to'} {label}
                      </TooltipContent>
                    </CommandItem>
                  </TooltipTrigger>
                </Tooltip>
              ))}
            </CommandGroup>
          </ScrollArea>
        )}
      </Command>
    </div>
  )
}
