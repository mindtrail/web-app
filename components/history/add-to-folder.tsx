import { useCallback, useState } from 'react'
import { PlusIcon, Cross2Icon, UploadIcon } from '@radix-ui/react-icons'

import { useGlobalState } from '@/context/global-state'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconFolder } from '@/components/ui/icons/next-icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type AddToFolderProps = {
  onAddToFolder: (props: AddItemToFolder) => void
}

const transitionStyle = 'transition-opacity duration-200 ease-in-out'

export function AddToFolder({ onAddToFolder }: AddToFolderProps) {
  const [state] = useGlobalState()
  const { nestedItemsByCategory } = state

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
                    onClick={() => onAddToFolder({ existingId: id })}
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
