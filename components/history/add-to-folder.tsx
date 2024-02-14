import { useCallback, useState } from 'react'
import { PlusIcon, Cross2Icon, UploadIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconFolder } from '@/components/ui/icons/next-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'

import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'
import { createCollection } from '@/lib/serverActions/collection'
import { addDataSourcesToCollection } from '@/lib/serverActions/dataSource'

type AddToFolderProps = {
  table: Table<HistoryItem>
  setAddToFolderVisibility: (value: boolean) => void
}

const ENTITY_TYPE = 'folder'
const transitionStyle = 'transition-opacity duration-200 ease-in-out'

export function AddToFolder({ table, setAddToFolderVisibility }: AddToFolderProps) {
  const { toast } = useToast()

  const [{ nestedItemsByCategory }] = useGlobalState()
  const { setNestedItemsByCategory, setActiveNestedSidebar } = useGlobalStateActions()

  const folderList = nestedItemsByCategory.folder

  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>(folderList)
  const [searchValue, setSearchValue] = useState('')

  const onFilterItems = useCallback(
    (value: string = '') => {
      if (!folderList?.length) {
        return
      }

      if (!value) {
        setSearchValue('')
        setFilteredItems(folderList)
        return
      }

      setSearchValue(value)

      value = value.toLowerCase()
      const filterResult = folderList.filter((item: any) =>
        item.name.toLowerCase().includes(value),
      )

      setFilteredItems(filterResult)
    },
    [folderList],
  )

  const onAddToFolder = useCallback(
    async (payload: AddItemToFolder) => {
      const { existingFolderId, newFolderName } = payload

      let collectionId = existingFolderId

      if (newFolderName) {
        try {
          const response = await createCollection({
            name: newFolderName,
            userId: '',
            description: '',
          })

          // @TODO: improve this
          if ('id' in response && 'name' in response && 'description' in response) {
            const { id, name, description } = response

            const newItem = {
              id,
              name,
              description,
              url: `/folder/${response.id}`,
            }

            collectionId = id
            const newItemList = [newItem, ...folderList]

            setNestedItemsByCategory({
              entityType: ENTITY_TYPE,
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

      const dataSourceIds = table
        .getSelectedRowModel() // @ts-ignore
        .rows.map(({ original }) => original.id)

      const result = await addDataSourcesToCollection(dataSourceIds, collectionId)

      console.log(result)
      // @ts-ignore
      if (result?.error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'No Items added to folder',
        })
        return console.log('No result')
      }

      // @ts-ignore
      const nrOfitemsAdded = result?.count
      const nrOfSelected = dataSourceIds?.length
      const nrOfExisting = nrOfSelected - nrOfitemsAdded

      toast({
        title: 'Success',
        description: `Added: ${nrOfitemsAdded} item(s).
        ${nrOfExisting ? `Existing: ${nrOfExisting} item(s).` : ''}`,
      })

      setAddToFolderVisibility(false)
      table.resetRowSelection()

      // @TODO: TBD if I keep this operation
      setActiveNestedSidebar(SIDEBAR_FOLDERS[ENTITY_TYPE])
    },
    [
      table,
      folderList,
      toast,
      setNestedItemsByCategory,
      setActiveNestedSidebar,
      setAddToFolderVisibility,
    ],
  )

  return (
    <div className='flex flex-col gap-3 items-start'>
      <div className='flex flex-col w-full'>
        <div className='search flex w-full items-center relative  mb-3'>
          <Input
            id='search'
            autoFocus
            className='w-full pl-4'
            value={searchValue}
            onChange={(e) => onFilterItems(e?.target?.value)}
            placeholder='Type to search or create...'
          />

          {searchValue && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-0'
              onClick={() => onFilterItems('')}
            >
              <Cross2Icon />
            </Button>
          )}
        </div>

        {/* there's some css issue here. Fixed it for now with 254 instead of */}
        <div className='-ml-4 w-[254px]'>
          <ScrollArea className='flex px-4 flex-col max-h-[35vh]'>
            {filteredItems?.map(({ id, name }: any) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Button
                    className='w-full px-2 justify-start flex gap-2 cursor-default group'
                    variant='ghost'
                    onClick={() => onAddToFolder({ existingFolderId: id })}
                  >
                    <span className='w-4 h-4 relative'>
                      <IconFolder
                        className={`${transitionStyle} absolute group-hover:opacity-0`}
                      />
                      <UploadIcon
                        className={`${transitionStyle} absolute opacity-0 group-hover:opacity-100`}
                      />
                    </span>

                    {/* <IconFolder className='group-hover:hidden' />
                    <UploadIcon className='hidden w-4 h-4 group-hover:flex' /> */}
                    {name}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='right' sideOffset={-48}>
                  Add items to {name}
                </TooltipContent>
              </Tooltip>
            ))}
          </ScrollArea>
        </div>

        {!filteredItems?.length && (
          <Button
            className='flex items-center gap-2 w-full justify-start'
            variant={filteredItems?.length ? 'ghost' : 'default'}
            onClick={() => onAddToFolder({ newFolderName: searchValue })}
          >
            <PlusIcon className='shrink-0' />
            <span className='max-w-44 truncate'>
              Add to Folder {!filteredItems?.length && searchValue}
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}
