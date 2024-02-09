import { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import {
  IconCancel,
  IconDotsVertical,
  IconFolder,
} from '@/components/ui/icons/next-icons'

type NestedItemProps = {
  item: SidebarItem
  pathname: string
  onUpdateFolderName: (id: string, newName: string) => void
  onDuplicate: (id: string) => void
  handleDelete: (id: string) => void
  setItems: (items: SidebarItem[]) => void
  setOpen: (open: boolean) => void
}

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

export const NestedItem: React.FC<NestedItemProps> = (props) => {
  const { item, pathname, onUpdateFolderName, onDuplicate, handleDelete } = props
  const { id, name, url } = item

  const [showMenuForItemId, setShowMenuForItemId] = useState<string | null>(null)

  // Inside NestedItem component
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})

  if (isEditing[id]) {
    return (
      <div className='mx-3 flex' key={url}>
        <input
          id='name'
          className='mt-1 block w-full appearance-none rounded-md px-3 py-2 placeholder-gray-400 shadow-sm border focus:border-black focus:outline-none focus:ring-black sm:text-sm'
          defaultValue={name}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onUpdateFolderName(id, (e?.target as HTMLInputElement).value)
            }
          }}
          autoFocus
        />
        <button
          onClick={() => {
            setIsEditing({ ...isEditing, [id]: false })
          }}
        >
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
        'px-2 flex justify-between items-center rounded-sm group mb-1',
      )}
    >
      <div className='flex items-center gap-2 flex-grow w-[50px]'>
        <IconFolder />
        <span className='truncate flex-grow'>{name}</span>
      </div>

      <div className='flex-shrink-0 hidden group-hover:block'>
        <button onClick={() => setShowMenuForItemId(id)}>
          <IconDotsVertical />
        </button>
        {showMenuForItemId === id && (
          <div className='absolute right-0 mt-1 bg-white border rounded shadow z-10'>
            <button
              onClick={() => {
                let isEditingArray = { ...isEditing }
                Object.keys(isEditing).forEach((id) => {
                  if (isEditing[id]) {
                    isEditingArray = {
                      ...isEditingArray,
                      [id]: false,
                    }
                  }
                })
                setIsEditing({
                  ...isEditingArray,
                  [id]: true,
                })
              }}
              className='w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
              Rename
            </button>
            <button
              onClick={() => onDuplicate(id)}
              className='w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
              Duplicate
            </button>
            <button
              onClick={() => handleDelete(id)}
              className='w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  )
}
