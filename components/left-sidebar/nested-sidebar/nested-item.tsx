import { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import {
  IconCancel,
  IconDotsVertical,
  IconFolder,
} from '@/components/ui/icons/next-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type NestedItemProps = {
  item: SidebarItem
  pathname: string
  onUpdateFolderName: (id: string, newName: string) => void
  onDuplicate: (id: string) => void
  handleDelete: (id: string) => void
}

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

export const NestedItem: React.FC<NestedItemProps> = (props) => {
  const { item, pathname, onUpdateFolderName, onDuplicate, handleDelete } = props
  const { id, name, url } = item

  // Inside NestedItem component
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className='mx-3 flex' key={url}>
        <Input
          autoFocus
          className='mt-1 block w-full appearance-none rounded-md px-3 py-2 placeholder-gray-400 shadow-sm border focus:border-black focus:outline-none focus:ring-black sm:text-sm'
          defaultValue={name}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onUpdateFolderName(id, (e?.target as HTMLInputElement).value)
            }
          }}
        />
        <button
          onClick={() => {
            setIsEditing(false)
          }}>
          <IconCancel />
        </button>
      </div>
    )
  }

  return (
    <Link
      href={url || ''}
      className={cn(
        SIDEBAR_BTN,
        pathname === url && ACTIVE_BTN,
        'px-2 flex justify-between items-center rounded-sm group/item mb-1',
      )}>
      <div className='flex items-center gap-2'>
        <IconFolder />
        <span className='truncate flex-grow'>{name}</span>
      </div>

      <div className='flex-shrink-0 hidden group-hover/item:flex'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5}>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <Separator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {
          <div className='absolute right-0 mt-1 bg-white border rounded shadow z-10'>
            <button
              onClick={() => {
                setIsEditing(true)
              }}
              className='w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Rename
            </button>
            <button
              onClick={() => onDuplicate(id)}
              className='w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Duplicate
            </button>
            <button
              onClick={() => handleDelete(id)}
              className='w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              Delete
            </button>
          </div>
        }
      </div>
    </Link>
  )
}
