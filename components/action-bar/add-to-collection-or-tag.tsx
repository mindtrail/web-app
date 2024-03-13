import { useCallback, useEffect, useState, useMemo, KeyboardEvent } from 'react'
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'

import { Typography } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconCollection, IconTag } from '@/components/ui/icons/next-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'

import { ENTITY_TYPE } from '@/lib/constants'
import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

import type { AddToCollectionOrTagProps, DropdownItem } from './constants'
import { CRUD_OPS, LABELS } from './constants'

export function AddToCollectionOrTag(props: AddToCollectionOrTagProps) {
  const { destintaionEntity: entityType, table } = props

  const { toast } = useToast()
  const [{ nestedItemsByCategory }] = useGlobalState()
  const { setNestedItemsByCategory, setActiveNestedSidebar } = useGlobalStateActions()

  const [searchValue, setSearchValue] = useState('')
  const [existingConnections, setExistingConnections] = useState<string[]>([])

  const selectedDataSources = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => original.id),
    [table],
  )

  const dropdownOptions: DropdownItem[] = useMemo(
    () =>
      nestedItemsByCategory[entityType]?.map(({ id, name }) => ({
        value: id,
        label: name,
        containsSelectedItems: existingConnections?.includes(id) ? 1 : 0,
      })),
    [existingConnections, entityType, nestedItemsByCategory],
  )

  const dropdownOpsMap: Record<string, string> = useMemo(
    () =>
      nestedItemsByCategory[entityType]?.reduce(
        (acc, { name }) => ({ ...acc, [name]: true }),
        {},
      ),
    [entityType, nestedItemsByCategory],
  )

  const EntityIcon = entityType === ENTITY_TYPE.COLLECTION ? IconCollection : IconTag

  useEffect(() => {
    const getCollectionsForSelectedDS = async () => {
      const existingConnections = (await CRUD_OPS[entityType].getExistingConnections(
        selectedDataSources,
      )) as string[]

      setExistingConnections(existingConnections)
    }

    // A small delay to don't block the UI when first loading the component
    setTimeout(() => {
      getCollectionsForSelectedDS()
    }, 400)
  }, [selectedDataSources, entityType])

  const onRemoveItemFromList = useCallback(
    async (itemId: string) => {
      if (!itemId || !existingConnections.includes(itemId)) {
        return console.error(' No collection ID to remove')
      }

      await CRUD_OPS[entityType].removeDSAndEntityConnection({
        id: itemId,
        dataSourceIdList: selectedDataSources,
      })

      setExistingConnections((prev) => prev.filter((id) => id !== itemId))

      toast({
        title: 'Success',
        description: `Removed: ${selectedDataSources?.length} item(s).`,
      })
      return
    },
    [existingConnections, entityType, selectedDataSources, toast],
  )

  const onAddItemsToList = useCallback(
    async (itemId: string) => {
      if (!itemId) {
        return console.error(' No collection ID found')
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
        return console.error('No result')
      }

      const nrOfSelected = selectedDataSources?.length
      const nrOfItemsAlreadyExisting = nrOfSelected - nrOfitemsAdded

      toast({
        title: 'Success',
        description: `Added: ${nrOfitemsAdded} item(s).
        ${nrOfItemsAlreadyExisting ? `Existing: ${nrOfItemsAlreadyExisting} item(s).` : ''}`,
      })

      setExistingConnections((prev: string[]) => [...prev, itemId])

      // @TODO: TBD if I keep this operation
      setActiveNestedSidebar(SIDEBAR_FOLDERS[entityType])
      // @TODO: Create an animation for the selected folder
    },
    [
      selectedDataSources,
      entityType,
      toast,
      setActiveNestedSidebar,
      setExistingConnections,
    ],
  )

  const createEntityAndAddItems = useCallback(
    async (name: string) => {
      try {
        const newEntity = await CRUD_OPS[entityType].createEntity({ name })
        // @TODO: improve this
        if ('id' in newEntity) {
          const { id } = newEntity

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

          setSearchValue('')
          await onAddItemsToList(id)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [entityType, nestedItemsByCategory, onAddItemsToList, setNestedItemsByCategory],
  )

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    const newFolderName = searchValue?.trim() || ''

    if (event.key === 'Enter' && newFolderName?.length >= 2) {
      const filteredOpts = dropdownOptions.filter(({ label }) =>
        label.includes(searchValue) ? 1 : 0,
      )

      if (filteredOpts.length > 0) {
        return
      }

      createEntityAndAddItems(newFolderName)
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='small' className='text-muted-foreground mt-1'>
        {LABELS[entityType].TITLE}
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
                    onSelect={() => {
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
                      {LABELS[entityType].TOOLTIP[containsSelectedItems]} {label}
                    </TooltipContent>
                  </CommandItem>
                </TooltipTrigger>
              </Tooltip>
            ))}
          </CommandGroup>
        </ScrollArea>
      </Command>
      {searchValue?.trim()?.length >= 2 && !dropdownOpsMap[searchValue?.trim()] && (
        <Tooltip>
          <TooltipTrigger asChild className='flex w-full relative'>
            <Button
              className='flex items-center gap-2 px-3 w-full justify-start'
              variant='ghost'
              disabled={searchValue?.trim()?.length < 2}
              onClick={() => createEntityAndAddItems(searchValue?.trim())}
            >
              <PlusIcon className='shrink-0' />
              <span className='max-w-44 truncate'>
                Add to: <strong>{searchValue}</strong>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right' sideOffset={-32}>
            {LABELS[entityType].TOOLTIP.CREATE}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
