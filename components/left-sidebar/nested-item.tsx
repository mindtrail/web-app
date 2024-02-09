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
  onUpdateFolderName: (id: string, newName: string) => void
  onDuplicate: (id: string) => void
  handleDelete: (id: string) => void
  setItems: (items: SidebarItem[]) => void
  setOpen: (open: boolean) => void
}

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'sidebar' }))
const NESTED_ITEM_STYLE = cn(SIDEBAR_BUTTON, 'pl-2')
const ACTIVE_SIDEBAR_BUTTON = 'text-gray font-semibold hover:text-gray '

interface ItemToDelete {
  id: string
  name?: string
}

export const NestedItem: React.FC<NestedItemProps> = (props) => {
  const { item, onUpdateFolderName, onDuplicate, handleDelete } = props
  const { id, name, url } = item

  const pathname = ''
  const [showMenuForItemId, setShowMenuForItemId] = useState<string | null>(null)

  // Inside NestedItem component
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})

  return (
    <>
      {isEditing[id] ? (
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
      ) : (
        <div
          className={cn(
            pathname === url && 'bg-gray-100',
            'p-2 flex justify-between items-center hover:bg-gray-100 rounded-sm group',
          )}
        >
          <Link
            href={url || ''}
            className={cn(
              NESTED_ITEM_STYLE,
              pathname === url && ACTIVE_SIDEBAR_BUTTON,
              'flex items-center gap-2 flex-grow w-[50px] ',
            )}
          >
            {pathname === url ? <IconFolder /> : <IconFolder />}
            <span className='truncate flex-grow'>{name}</span>
            {/* Apply truncate and flex-grow */}
          </Link>
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
        </div>
      )}
    </>
  )
}
