import { useState } from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { IconFolder } from '@/components/ui/icons/next-icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { NestedItemInput } from '@/components/left-sidebar/nested-sidebar/item-input'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type NestedItemProps = {
  activeNestedSidebar: NestedSidebarItem
  item: SidebarItem
  pathname: string
  onUpdateFolderName: (id: string, newName: string) => void
  onDuplicate: (id: string) => void
  onDelete: (item: SidebarItem) => void
}

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

export const NestedItem = (props: NestedItemProps) => {
  const { activeNestedSidebar, item, pathname, onUpdateFolderName, onDelete } = props
  const { url, entityType, icon } = activeNestedSidebar
  const { id, name } = item

  const [newName, setNewName] = useState(name)
  const [renameInputVisible, setRenameInputVisible] = useState(false)

  const itemUrl = `${url}/${id}`
  const IconUsed = entityType === 'folder' ? IconFolder : icon

  const handleUpdate = () => {
    onUpdateFolderName(id, newName)
    setRenameInputVisible(false)
  }

  if (renameInputVisible) {
    return (
      <NestedItemInput
        item={item}
        opInProgress={renameInputVisible}
        newName={newName}
        setInputVisibility={setRenameInputVisible}
        setNewName={setNewName}
        callbackFn={handleUpdate}
      />
    )
  }

  return (
    <Link
      href={itemUrl || ''}
      onDoubleClick={() => setRenameInputVisible(true)}
      className={cn(
        SIDEBAR_BTN,
        pathname === itemUrl && ACTIVE_BTN,
        'flex justify-between items-center px-2 rounded-sm group/item gap-0',
      )}
    >
      <span className='flex items-center gap-2 '>
        <IconUsed />
        <span className='truncate max-w-[110px]'>{newName}</span>
      </span>

      <span className='flex-shrink-0 invisible group-hover/item:visible relative'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-slate-200 dark:hover:bg-slate-700 '
            >
              <DotsVerticalIcon className='text-secondary-foreground' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={-4}>
            <DropdownMenuItem onClick={() => setRenameInputVisible(true)}>
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
