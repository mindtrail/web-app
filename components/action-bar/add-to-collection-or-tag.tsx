import { useCallback, useEffect, useState, useMemo, KeyboardEvent } from 'react'
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Typography } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconCollection, IconTag } from '@/components/ui/icons/next-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'

import { ENTITY_TYPE } from '@/lib/constants'
import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'

import { createCollection } from '@/lib/serverActions/collection'
import {
  addDataSourcesToCollection,
  removeDataSourceFromCollection,
  getCollectionsForDataSourceList,
} from '@/lib/serverActions/dataSource'
import {
  createTag,
  addTagToDataSources,
  removeTagFromDataSources,
  getTagsForDataSourcesList,
} from '@/lib/serverActions/tag'

type AddToCollectionOrTagProps = {
  currentItemId?: string
  destintaionEntity: EntityType
  table: Table<HistoryItem>
}

type DropdownItem = {
  value: string
  label: string
  containsSelectedItems?: boolean
}

type CrudOperations = {
  [key in EntityType]: {
    createEntity: any
    createDSAndEntityConnection: any
    removeDSAndEntityConnection: any
    getExistingConnections: any
  }
}

const CRUD_OPS: CrudOperations = {
  [ENTITY_TYPE.COLLECTION]: {
    createEntity: createCollection,
    createDSAndEntityConnection: addDataSourcesToCollection,
    removeDSAndEntityConnection: removeDataSourceFromCollection,
    getExistingConnections: getCollectionsForDataSourceList,
  },
  [ENTITY_TYPE.TAG]: {
    createEntity: createTag,
    createDSAndEntityConnection: addTagToDataSources,
    removeDSAndEntityConnection: removeTagFromDataSources,
    getExistingConnections: getTagsForDataSourcesList,
  },
}

export function AddToCollectionOrTag(props: AddToCollectionOrTagProps) {
  const { destintaionEntity: entityType, table } = props

  const { toast } = useToast()
  const [{ nestedItemsByCategory }] = useGlobalState()
  const { setNestedItemsByCategory, setActiveNestedSidebar } = useGlobalStateActions()

  const [searchValue, setSearchValue] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState<DropdownItem[]>([])

  const selectedDataSources = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => original.id),
    [table],
  )

  const [connectedDropdownOptions, setConnectedDropdownOptions] = useState<string[]>([])

  const EntityIcon = entityType === ENTITY_TYPE.COLLECTION ? IconCollection : IconTag

  const popupTitle =
    entityType === ENTITY_TYPE.COLLECTION
      ? 'Add/Remove Items to Collection'
      : 'Set Tags on Items'

  useEffect(() => {
    const getCollectionsForSelectedDS = async () => {
      const existingConnections = (await CRUD_OPS[entityType].getExistingConnections(
        selectedDataSources,
      )) as string[]

      setConnectedDropdownOptions(existingConnections)
    }

    // A small delay to don't block the UI when first loading the component
    setTimeout(() => {
      getCollectionsForSelectedDS()
    }, 400)
  }, [selectedDataSources, entityType])

  const onRemoveItemFromList = useCallback(
    async (itemId: string) => {
      if (!itemId || !connectedDropdownOptions.includes(itemId)) {
        return console.log(' No collection ID to remove')
      }

      await CRUD_OPS[entityType].removeDSAndEntityConnection({
        id: itemId,
        dataSourceIdList: selectedDataSources,
      })

      setConnectedDropdownOptions((prev) => prev.filter((id) => id !== itemId))

      toast({
        title: 'Success',
        description: `Removed: ${selectedDataSources?.length} item(s).`,
      })
      return
    },
    [connectedDropdownOptions, entityType, selectedDataSources, toast],
  )

  const onAddItemsToList = useCallback(
    async (itemId: string) => {
      if (!itemId) {
        return console.log(' No collection ID found')
      }

      const result = await CRUD_OPS[entityType].createDSAndEntityConnection({
        id: itemId,
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

      setConnectedDropdownOptions((prev: string[]) => [...prev, itemId])

      // @TODO: TBD if I keep this operation
      setActiveNestedSidebar(SIDEBAR_FOLDERS[entityType])
      // @TODO: Create an animation for the selected folder
    },
    [
      selectedDataSources,
      entityType,
      toast,
      setActiveNestedSidebar,
      setConnectedDropdownOptions,
    ],
  )

  const createCollectionAndAddItems = useCallback(
    async (name: string) => {
      try {
        const newCollection = await createCollection({ name })
        // @TODO: improve this
        if ('id' in newCollection) {
          const { id } = newCollection

          const newItem = {
            id,
            name,
            url: `/${entityType}/${id}`,
          }

          const newItemList = [newItem, ...nestedItemsByCategory[entityType]]
          setNestedItemsByCategory({
            entityType,
            items: newItemList,
          })

          await onAddItemsToList(id)

          return id
        }
      } catch (error) {
        console.error(error)
      }
    },
    [entityType, nestedItemsByCategory, onAddItemsToList, setNestedItemsByCategory],
  )

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    const newFolderName = searchValue?.trim() || ''

    console.log(searchValue)

    // if (event.key === 'Enter' && newFolderName?.length >= 2) {
    //   const collectionId = await createCollectionAndAddItems(newFolderName)

    //   if (!collectionId) {
    //     console.error('No collection ID - created')
    //     return
    //   }
    //   setSearchValue('')
    // }
  }

  useEffect(() => {
    const dropdownOps = nestedItemsByCategory[entityType]?.map(({ id, name }) => ({
      value: id,
      label: name,
      containsSelectedItems: connectedDropdownOptions?.includes(id),
    }))
    setDropdownOptions(dropdownOps)
  }, [nestedItemsByCategory, entityType, connectedDropdownOptions])

  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='small' className='text-muted-foreground mt-1'>
        {popupTitle}
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
              disabled={searchValue?.trim()?.length < 2}
              onClick={() => createCollectionAndAddItems(searchValue?.trim())}
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
            {dropdownOptions.map(({ value, label, containsSelectedItems }, index) => (
              <Tooltip key={index}>
                <TooltipTrigger className='flex w-full relative'>
                  <CommandItem
                    className={`flex flex-1 gap-2
                      ${containsSelectedItems && 'text-primary data-[selected=true]:text-primary'}
                    `}
                    onSelect={(event) => {
                      console.log(event)

                      containsSelectedItems
                        ? onRemoveItemFromList(value)
                        : onAddItemsToList(value)
                    }}
                  >
                    {containsSelectedItems ? (
                      <CheckIcon className='w-4 h-4' />
                    ) : (
                      <EntityIcon />
                    )}
                    {label}
                    <TooltipContent
                      side='right'
                      sideOffset={-32}
                      className={containsSelectedItems ? 'bg-destructive text-white' : ''}
                    >
                      {containsSelectedItems ? 'Remove from:' : 'Add to:'} {label}
                    </TooltipContent>
                  </CommandItem>
                </TooltipTrigger>
              </Tooltip>
            ))}
            {/* {searchValue?.trim()?.length >= 2 && (
              <Tooltip>
                <TooltipTrigger className='flex w-full relative'>
                  <CommandItem
                    className={`flex flex-1 gap-2`}
                    onSelect={(event) => {
                      console.log(event)

                      onAddItemsToList(searchValue?.trim())
                    }}
                  >
                    <EntityIcon />
                    {searchValue}
                    <TooltipContent side='right' sideOffset={-32}>
                      Add to: {searchValue}
                    </TooltipContent>
                  </CommandItem>
                </TooltipTrigger>
              </Tooltip>
            )} */}
          </CommandGroup>
        </ScrollArea>
      </Command>
    </div>
  )
}
