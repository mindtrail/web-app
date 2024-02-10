import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '@/components/ui/button'
import { IconDotsVertical, IconFolder } from '@/components/ui/icons/next-icons'
import { EditableInput } from './editable-input'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type NestedItemProps = {
  item: SidebarItem
  pathname: string
  nestedSidebar: NestedSidebarProps
  onUpdateFolderName: (id: string, newName: string) => void
  onDuplicate: (id: string) => void
  onDelete: (item: SidebarItem) => void
}

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

export const NestedItem: React.FC<NestedItemProps> = (props) => {
  const { item, pathname, nestedSidebar, onUpdateFolderName, onDelete } = props
  const { id, name } = item

  const inputRef = useRef(null)
  const [inputVisibility, setInputVisibility] = useState(false)
  const [itemName, setItemName] = useState(name)

  const itemUrl = `${nestedSidebar.url}/${id}`

  const handleUpdate = () => {
    onUpdateFolderName(id, itemName)
    setInputVisibility(false)
  }

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
  }, [inputRef])

  if (inputVisibility) {
    return (
      <EditableInput
        item={item}
        itemName={itemName}
        setInputVisibility={setInputVisibility}
        setItemName={setItemName}
        callbackFn={handleUpdate}
      />
    )
  }

  return (
    <Link
      href={itemUrl || ''}
      className={cn(
        SIDEBAR_BTN,
        pathname === itemUrl && ACTIVE_BTN,
        'flex justify-between items-center px-2 rounded-sm group/item gap-0',
      )}
    >
      <span className='flex items-center gap-2 '>
        <IconFolder />
        <span className='truncate max-w-[110px]'>{itemName}</span>
      </span>

      <span className='flex-shrink-0 invisible group-hover/item:visible relative'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-slate-200 dark:hover:bg-slate-700 '
            >
              <IconDotsVertical className='text-secondary-foreground' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={-6}>
            <DropdownMenuItem onClick={() => setInputVisibility(true)}>
              Rename
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => onDuplicate(id)}>Duplicate</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(item)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </Link>
  )
}
