import { useEffect, useCallback, useState, useRef, KeyboardEvent } from 'react'
import { ChevronLeftIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { IconCancel, IconFolder, IconSearch } from '@/components/ui/icons/next-icons'

interface TopNestedSectionProps {
  itemsCount: number
  secondSidebar?: SidebarFoldersProps
  onSaveNewItem: (name: string) => void
  onFilterItems: (value: string) => void
  setSecondSidebar: (value?: any) => void
}

export function NestedTopSection(props: TopNestedSectionProps) {
  const { secondSidebar, setSecondSidebar, onSaveNewItem, onFilterItems, itemsCount } =
    props

  const inputRef = useRef(null)
  const [searchValue, setSearchValue] = useState('')

  const [newItemName, setNewItemName] = useState('')
  const [createNewItem, setCreateNewItem] = useState(false)

  const handleKeyDown = useCallback(
    async (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSaveNewItem(newItemName)
        setNewItemName('')
        setCreateNewItem(false)
        return
      }

      if (event.key === 'Escape') {
        setCreateNewItem(false)
        setNewItemName('')
      }
    },
    [newItemName, onSaveNewItem],
  )

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value)
      onFilterItems(value)
    },
    [onFilterItems],
  )

  useEffect(() => {
    // Alert if clicked outside of element)
    function handleClickOutside(event: { target: any }) {
      if (inputRef.current && !(inputRef.current as HTMLElement).contains(event.target)) {
        setCreateNewItem(false) // Closes the new folder input
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef])

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
          onChange={(e) => handleSearch(e?.target?.value)}
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
        <div
          ref={inputRef}
          className='flex items-center mt-4 mb-2 mx-2 pl-2 gap-1 rounded relative bg-accent'>
          <IconFolder />
          <Input
            autoFocus
            className='flex-1 border bg-background pl-2 pr-8'
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`New ${secondSidebar?.entity}`}
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
    </div>
  )
}
