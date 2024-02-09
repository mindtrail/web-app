import { useState, KeyboardEvent } from 'react'
import { ChevronLeftIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
  IconCancel,
  IconFolder,
  IconPlus,
  IconSearch,
} from '@/components/ui/icons/next-icons'

interface TopNestedSectionProps {
  itemsCount: number
  secondSidebar?: SidebarFoldersProps
  onSaveNewItem: () => void
  onFilterItems: (value: string) => void
  setSecondSidebar: (value?: any) => void
}

export function NestedTopSection(props: TopNestedSectionProps) {
  const { secondSidebar, setSecondSidebar, onSaveNewItem, onFilterItems, itemsCount } =
    props

  const [searchValue, setSearchValue] = useState('')

  const [newItemName, setNewItemName] = useState('')
  const [createNewItem, setCreateNewItem] = useState(false)
  const [createNewItemButton, setCreateNewItemButton] = useState(false)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, callback: Function) => {
    if (event.key === 'Enter') {
      callback()
    }
  }

  return (
    <div className='flex flex-col gap-1'>
      <div className='heading px-2 py-2 flex justify-between items-center'>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon' onClick={() => setSecondSidebar()}>
            <ChevronLeftIcon width={16} height={16} />
          </Button>
          <span className='flex-1 overflow-hidden whitespace-nowrap capitalize'>
            {secondSidebar?.name} - {itemsCount}
          </span>
        </div>

        <Button
          className='invisible group-hover:visible'
          variant='ghost'
          size='icon'
          onClick={() => setCreateNewItem(true)}>
          <PlusIcon width={16} height={16} />
        </Button>
      </div>

      <div className='search flex w-full items-center relative'>
        <Input
          id='search'
          className='flex-1 border-[1px] mx-2 px-2'
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            onFilterItems(e.target.value)
          }}
          placeholder='Search'
        />

        {!searchValue ? (
          <IconSearch className='absolute right-4 opacity-50' />
        ) : (
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-2'
            onClick={() => {
              setSearchValue('')
              onFilterItems('')
            }}>
            <Cross2Icon />
          </Button>
        )}
      </div>

      {createNewItem && (
        <div className='flex items-center mx-2 pl-2 gap-1 rounded relative bg-accent'>
          <IconFolder />
          <Input
            autoFocus
            className='text-xs flex-1 border bg-background px-2'
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, onSaveNewItem)}
            placeholder={`New ${secondSidebar?.name}`}
          />
          <Button
            className='absolute right-0'
            variant='ghost'
            size='icon'
            onClick={() => {
              setCreateNewItem(false)
              setNewItemName('')
            }}>
            <IconCancel />
          </Button>
        </div>
      )}

      {createNewItemButton && (
        <div className='mx-4 mt-2 pb-2 flex items-center w-full'>
          <Button
            onClick={() => {
              setCreateNewItem(true)
              setCreateNewItemButton(false)
              setNewItemName(searchValue)
            }}
            className='text-xs font-normal'>
            <IconPlus className='mr-2' />
            Create folder
          </Button>
        </div>
      )}
    </div>
  )
}
