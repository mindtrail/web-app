import { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type NestedItemProps = {
  item: SidebarItem
  pathname: string
  onUpdateFolderName: (id: string, newName: string) => void
  onDuplicate: (id: string) => void
  onDelete: (item: SidebarItem) => void
}

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

export const NestedItem: React.FC<NestedItemProps> = (props) => {
  const { item, pathname, onUpdateFolderName, onDuplicate, onDelete } = props
  const { id, name, url } = item

  // Inside NestedItem component
  const [isEditing, setIsEditing] = useState(false)

  // if (isEditing) {
  //   return (
  //     <div className='mx-3 flex' key={url}>
  //       <Input
  //         autoFocus
  //         className='mt-1 block w-full appearance-none rounded-md px-3 py-2 placeholder-gray-400 shadow-sm border focus:border-black focus:outline-none focus:ring-black sm:text-sm'
  //         defaultValue={name}
  //         onKeyDown={(e) => {
  //           if (e.key === 'Enter') {
  //             onUpdateFolderName(id, (e?.target as HTMLInputElement).value)
  //           }
  //         }}
  //       />
  //       <Button onClick={() => setIsEditing(false)}>
  //         <IconCancel />
  //       </Button>
  //     </div>
  //   )
  // }

  return (
    <Link
      href={url || ''}
      className={cn(
        SIDEBAR_BTN,
        pathname === url && ACTIVE_BTN,
        'px-2 flex justify-between items-center rounded-sm group/item mb-1',
      )}
    >
      <div className='flex items-center gap-2'>
        <IconFolder />
        <span className='truncate flex-grow'>{name}</span>
      </div>

      <div className='flex-shrink-0 invisible group-hover/item:visible relative'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5}>
            <DropdownMenuItem onClick={() => setIsEditing(true)}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(id)}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(item)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  )
}
