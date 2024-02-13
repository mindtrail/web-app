import { useState } from 'react'
import { ChevronLeftIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch } from '@/components/ui/icons/next-icons'

import { EditableInput } from '@/components/editable-input'

interface TopNestedSectionProps {
  activeNestedSidebar: NestedSidebarItem
  searchValue: string
  itemsCount: string
  opInProgress: boolean
  onSaveNewItem: (name: string) => void
  onFilterItems: (value: string) => void
  setActiveNestedSidebar: (value?: any) => void
}

export function NestedTopSection(props: TopNestedSectionProps) {
  const {
    activeNestedSidebar,
    searchValue,
    itemsCount,
    opInProgress,
    setActiveNestedSidebar,
    onSaveNewItem,
    onFilterItems,
  } = props

  const { entityType, name } = activeNestedSidebar

  const [newItemName, setNewItemName] = useState('')
  const [inputVisibility, setInputVisibility] = useState(false)

  const handleSave = () => {
    onSaveNewItem(newItemName)
    setInputVisibility(false)
  }

  return (
    <div className='flex flex-col'>
      <div className='heading px-2 py-2 flex justify-between items-center'>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon' onClick={() => setActiveNestedSidebar()}>
            <ChevronLeftIcon width={16} height={16} />
          </Button>
          <span className='flex-1 overflow-hidden whitespace-nowrap capitalize'>
            {name} ({itemsCount})
          </span>
        </div>

        <Button
          className='invisible group-hover:visible'
          variant='ghost'
          size='icon'
          onClick={() => {
            setInputVisibility(true)
            setNewItemName('')
          }}
        >
          <PlusIcon width={16} height={16} />
        </Button>
      </div>

      <div className='search flex w-full items-center relative'>
        <Input
          id='search'
          className='mx-2'
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
            entityType={entityType}
            setItemName={setNewItemName}
            setInputVisibility={setInputVisibility}
            callbackFn={handleSave}
          />
        </div>
      )}
    </div>
  )
}
