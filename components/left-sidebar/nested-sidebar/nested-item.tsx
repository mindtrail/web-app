import { useEffect, useState } from 'react'
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
  opInProgress: boolean
  onRename: (id: string, newName: string) => void
  onDuplicate: (id: string) => void
  onDelete: (item: SidebarItem) => void
}

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

export const NestedItem = (props: NestedItemProps) => {
  const { activeNestedSidebar, item, pathname, opInProgress, onRename, onDelete } = props
  const { url, entityType, icon } = activeNestedSidebar
  const { id, name: originalName } = item

  const [newName, setNewName] = useState(originalName)
  const [renameInputVisible, setRenameInputVisible] = useState(false)

  const itemUrl = `${url}/${id}`
  const IconUsed = entityType === 'folder' ? IconFolder : icon

  const handleUpdate = () => {
    onRename(id, newName)
  }

  useEffect(() => {
    setRenameInputVisible(false)
  }, [originalName])

  if (renameInputVisible) {
    return (
      <NestedItemInput
        item={item}
        opInProgress={opInProgress}
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
        'flex justify-between items-center pl-2 pr-0 rounded-sm group/item gap-0',
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
