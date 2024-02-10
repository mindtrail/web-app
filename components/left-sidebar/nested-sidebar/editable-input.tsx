import { useEffect, useRef, useState, KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { IconCancel, IconFolder, IconSpinner } from '@/components/ui/icons/next-icons'

type EditableInput = {
  item?: SidebarItem
  itemName: string
  opInProgress?: boolean
  setInputVisibility: (isEditing: boolean) => void
  setItemName: (itemName: string) => void
  callbackFn: () => void
}

export const EditableInput = (props: EditableInput) => {
  const { item, itemName, opInProgress, setInputVisibility, setItemName, callbackFn } =
    props

  const inputRef = useRef(null)

  useEffect(() => {
    // Alert if clicked outside of element)
    function handleClickOutside(event: { target: any }) {
      if (inputRef.current && !(inputRef.current as HTMLElement).contains(event.target)) {
        setInputVisibility(false) // Closes the new folder input
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef, setInputVisibility])

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      callbackFn()
      setInputVisibility(false) // Closes the new folder input
      return
    }

    if (event.key === 'Escape') {
      setItemName(item?.name || '') // Resets the text value
      setInputVisibility(false) // Closes the new folder input
    }
  }

  return (
    <div
      ref={inputRef}
      className='flex items-center relative gap-1 px-2 rounded h-9 bg-accent'
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
        value={itemName}
        disabled={opInProgress}
        className='flex-1 border bg-background pl-1 pr-8 h-8'
        onChange={(e) => setItemName(e?.target?.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className='absolute right-2'
        variant='ghost'
        size='icon'
        onClick={() => setInputVisibility(false)}
      >
        <IconCancel />
      </Button>
    </div>
  )
}
