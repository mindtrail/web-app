import { useCallback, useState } from 'react'
import { PlusIcon, Cross2Icon } from '@radix-ui/react-icons'

import { useGlobalState } from '@/context/global-state'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { IconSearch } from '@/components/ui/icons/next-icons'
import { Typography } from '@/components/typography'
import { NestedItemInput } from '@/components/left-sidebar/item-input'

export function AddToFolder() {
  const [state] = useGlobalState()
  const { nestedItemsByCategory } = state

  const folderList = nestedItemsByCategory.folder

  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>(folderList)
  const [loading, setLoading] = useState(true)

  const [searchValue, setSearchValue] = useState('')

  console.log(folderList)

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

  const handleFolderClick = useCallback((item: any) => {
    // TODO - add to collection
  }, [])

  return (
    <div className='flex flex-col gap-3 items-start'>
      <Button variant='ghost' className='flex items-center gap-2 w-full justify-start'>
        <PlusIcon />
        <span>New Folder</span>
      </Button>
      <Separator />
      <div className='flex flex-col w-full'>
        <div className='search flex w-full items-center relative my-2'>
          <Input
            id='search'
            className='w-full pl-4'
            value={searchValue}
            onChange={(e) => onFilterItems(e?.target?.value)}
            placeholder='Search'
          />

          {!searchValue ? (
            <IconSearch className='absolute right-4 opacity-50' />
          ) : (
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2'
              // onClick={() => onFilterItems('')}
            >
              <Cross2Icon />
            </Button>
          )}
        </div>
        {filteredItems.map((item: any) => (
          <Button
            key={item.id}
            className='w-full justify-start'
            variant='ghost'
            onClick={handleFolderClick}
          >
            {item?.name}
          </Button>
        ))}

        {!filteredItems?.length && (
          <Typography className='w-full mt-2 py-4 px-4 max-w-52 truncate' variant='small'>
            No folder:
            <span className='font-semibold text-foreground'> {searchValue}</span>{' '}
          </Typography>
        )}
      </div>
    </div>
  )
}
