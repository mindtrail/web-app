import { useEffect, useCallback, useState } from 'react'
import { ChevronLeftIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch } from '@/components/ui/icons/next-icons'

import { EditableInput } from './editable-input'

interface TopNestedSectionProps {
  searchValue: string
  itemsCount: string
  opInProgress: boolean
  nestedSidebar?: NestedSidebarProps
  onSaveNewItem: (name: string) => void
  onFilterItems: (value: string) => void
  setNestedSidebar: (value?: any) => void
}

export function NestedTopSection(props: TopNestedSectionProps) {
  const {
    searchValue,
    itemsCount,
    opInProgress,
    nestedSidebar,
    setNestedSidebar,
    onSaveNewItem,
    onFilterItems,
  } = props

  const [newItemName, setNewItemName] = useState('')
  const [inputVisibility, setInputVisibility] = useState(false)

  const handleSave = () => {
    onSaveNewItem(newItemName)
    setInputVisibility(false)
  }

  return (
    <div className='flex flex-col gap'>
      <div className='heading px-2 py-2 flex justify-between items-center'>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon' onClick={() => setNestedSidebar()}>
            <ChevronLeftIcon width={16} height={16} />
          </Button>
          <span className='flex-1 overflow-hidden whitespace-nowrap capitalize'>
            {nestedSidebar?.name} ({itemsCount})
          </span>
        </div>

        <Button
          className='invisible group-hover:visible'
          variant='ghost'
          size='icon'
          onClick={() => {
            setInputVisibility(true)
            setNewItemName(`New ${nestedSidebar?.entityType}`) // Reset
          }}
        >
          <PlusIcon width={16} height={16} />
        </Button>
      </div>

      <div className='search flex w-full items-center relative'>
        <Input
          id='search'
          className='flex-1 border-[1px] mx-2 px-2'
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
            onClick={() => onFilterItems('')}
          >
            <Cross2Icon />
          </Button>
        )}
      </div>

      {(inputVisibility || opInProgress) && (
        <div className='pt-4 -mt-[2px] -mb-2 px-2'>
          <EditableInput
            itemName={newItemName}
            opInProgress={opInProgress}
            setItemName={setNewItemName}
            setInputVisibility={setInputVisibility}
            callbackFn={handleSave}
          />
        </div>
      )}
    </div>
  )
}
