import { useCallback, useEffect, useState, useMemo, KeyboardEvent } from 'react'
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconFolder, IconTag } from '@/components/ui/icons/next-icons'
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
  removeDataSourceFromCollection,
  getCollectionsForDataSourceList,
} from '@/lib/serverActions/dataSource'

import {
  addTagToDataSources,
  removeTagFromDataSources,
  getTagsForDataSourcesList,
} from '@/lib/serverActions/tag'

type AddToFolderProps = {
  currentItemId?: string
  destintaionEntity: 'folder' | 'tag'
  table: Table<HistoryItem>
}

const CRUD_OPERATIONS = {
  folder: {
    createEntityAndDSConnection: addDataSourcesToCollection,
    removeEnityAndDSConnection: removeDataSourceFromCollection,
    getExistingConnections: getCollectionsForDataSourceList,
  },
  tag: {
    createEntityAndDSConnection: addTagToDataSources,
    removeEnityAndDSConnection: removeTagFromDataSources,
    getExistingConnections: getTagsForDataSourcesList,
  },
}

export function AddToFolder(props: AddToFolderProps) {
  const { destintaionEntity: entityType, table } = props

  const { toast } = useToast()
  const [{ nestedItemsByCategory }] = useGlobalState()
  const { setNestedItemsByCategory, setActiveNestedSidebar } = useGlobalStateActions()

  const [searchValue, setSearchValue] = useState('')

  const selectedDataSources = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => original.id),
    [table],
  )

  const [dropdownOptsContainingSelectedDS, setDropdownOptsContainingSelectedDS] =
    useState<string[]>([])

  const dopdownList = useMemo(
    () =>
      nestedItemsByCategory[entityType]?.map(({ id, name }) => ({
        value: id,
        label: name,
        containsSelectedItems: dropdownOptsContainingSelectedDS?.includes(id),
      })),
    [nestedItemsByCategory, entityType, dropdownOptsContainingSelectedDS],
  )

  useEffect(() => {
    const getCollectionsForSelectedDS = async () => {
      const dropdownItems = (await CRUD_OPERATIONS[entityType].getExistingConnections(
        selectedDataSources,
      )) as string[]

      setDropdownOptsContainingSelectedDS(dropdownItems)
    }

    // A small delay to don't block the UI when first loading the component
    setTimeout(() => {
      getCollectionsForSelectedDS()
    }, 400)
  }, [selectedDataSources, entityType])

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
              url: `/${entityType}/${newCollectionId}`,
            }

            const newItemList = [newItem, ...nestedItemsByCategory[entityType]]
            setNestedItemsByCategory({
              entityType,
              items: newItemList,
            })
          }
        } catch (error) {
          console.log(error)
        }
      }

      if (!collectionId) {
        return console.log(' No collection ID found')
      }

      if (dropdownOptsContainingSelectedDS.includes(collectionId)) {
        // @TODO: remove them from that folder
        await CRUD_OPERATIONS[entityType].removeEnityAndDSConnection({
          id: collectionId,
          dataSourceIdList: selectedDataSources,
        })
        setDropdownOptsContainingSelectedDS((prev) =>
          prev.filter((id) => id != collectionId),
        )

        toast({
          title: 'Success',
          description: `Removed: ${selectedDataSources?.length} item(s).`,
        })
        return
      }

      const result = await CRUD_OPERATIONS[entityType].createEntityAndDSConnection({
        id: collectionId,
        dataSourceIdList: selectedDataSources,
      })
      // @ts-ignore
      const { error, count: nrOfitemsAdded } = result

      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'No Items added to' + entityType,
        })
        return console.log('No result')
      }

      const nrOfSelected = selectedDataSources?.length
      const nrOfItemsAlreadyExisting = nrOfSelected - nrOfitemsAdded

      toast({
        title: 'Success',
        description: `Added: ${nrOfitemsAdded} item(s).
        ${nrOfItemsAlreadyExisting ? `Existing: ${nrOfItemsAlreadyExisting} item(s).` : ''}`,
      })

      setDropdownOptsContainingSelectedDS((prev: string[]) =>
        collectionId ? [...prev, collectionId] : prev,
      )

      // @TODO: TBD if I keep this operation
      setActiveNestedSidebar(SIDEBAR_FOLDERS[entityType])
      // @TODO: Create an animation for the selected folder
      // animation...
    },
    [
      selectedDataSources,
      dropdownOptsContainingSelectedDS,
      nestedItemsByCategory,
      entityType,
      toast,
      setNestedItemsByCategory,
      setActiveNestedSidebar,
      setDropdownOptsContainingSelectedDS,
    ],
  )

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchValue?.length > 2) {
      await onAddToFolder({ newFolderName: searchValue })
      setSearchValue('')
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='small' className='text-muted-foreground mt-1'>
        {entityType === 'folder' ? 'Add items to folders' : 'Set tags on selected items'}
      </Typography>

      <Command
        className='-ml-4 mt-1 w-[254px] overflow-auto'
        // @ts-ignore
        onChange={(e) => setSearchValue(e.target?.value)}
        onKeyDown={handleKeyDown}
      >
        <div className='px-4 py-2'>
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder='Type to search or create...'
          />
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
        <ScrollArea className='flex flex-col max-h-[40vh] px-4'>
          <CommandGroup className='px-0'>
            {dopdownList.map(({ value, label, containsSelectedItems }, index) => (
              <Tooltip key={index}>
                <TooltipTrigger className='flex w-full relative'>
                  <CommandItem
                    className={`flex flex-1 gap-2
                      ${containsSelectedItems && 'text-primary data-[selected=true]:text-primary'}`}
                    onSelect={() => onAddToFolder({ existingFolderId: value })}
                  >
                    {containsSelectedItems ? (
                      <CheckIcon className='w-4 h-4' />
                    ) : entityType === 'folder' ? (
                      <IconFolder />
                    ) : (
                      <IconTag />
                    )}
                    {label}
                    <TooltipContent
                      side='right'
                      sideOffset={-32}
                      className={containsSelectedItems ? 'bg-destructive text-white' : ''}
                    >
                      {containsSelectedItems ? 'Remove from' : 'Add to'} {label}
                    </TooltipContent>
                  </CommandItem>
                </TooltipTrigger>
              </Tooltip>
            ))}
          </CommandGroup>
        </ScrollArea>
      </Command>
    </div>
  )
}
