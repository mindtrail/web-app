import { useEffect, useRef, KeyboardEvent } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { IconFolder, IconSpinner } from '@/components/ui/icons/next-icons'

type NestedItemInput = {
  item?: SidebarItem
  newName: string
  opInProgress?: boolean
  entityType?: string
  setInputVisibility: (isEditing: boolean) => void
  setNewName: (newName: string) => void
  callbackFn: any
}

export const NestedItemInput = (props: NestedItemInput) => {
  const {
    item,
    newName,
    opInProgress,
    entityType = 'folder',
    setInputVisibility,
    setNewName,
    callbackFn,
  } = props

  const inputRef = useRef(null)

  useEffect(() => {
    // Alert if clicked outside of element)
    function handleClickOutside(event: { target: any }) {
      if (inputRef.current && !(inputRef.current as HTMLElement).contains(event.target)) {
        setInputVisibility(false) // Closes the new folder input
        setNewName(item?.name || '') // Resets the text value
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef, setInputVisibility, item, setNewName])

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      return callbackFn()
    }

    if (event.key === 'Escape') {
      setNewName(item?.name || '') // Resets the text value
      setInputVisibility(false) // Closes the new folder input
    }
  }

  return (
    <div
      ref={inputRef}
      className='flex items-center relative gap-1 pl-2 rounded bg-accent'
    >
      {opInProgress ? (
        <span className='w-5 flex justify-center'>
          <IconSpinner />
        </span>
      ) : (
        <IconFolder />
      )}
      <Input
        autoFocus
        placeholder={`New ${entityType}`}
        value={newName}
        disabled={opInProgress}
        className='flex-1 border bg-background pl-1 pr-6'
        onChange={(e) => setNewName(e?.target?.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className='absolute right-0'
        variant='ghost'
        size='icon'
        onClick={() => setInputVisibility(false)}
      >
        <Cross2Icon className='w-4 h-4' />
      </Button>
    </div>
  )
}
