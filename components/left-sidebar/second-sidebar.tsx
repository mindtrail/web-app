import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, Cross2Icon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { NestedItem } from '@/components/left-sidebar/nested-item'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from '@/lib/serverActions/collection'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  IconCancel,
  IconDotsVertical,
  IconFolder,
  IconPlus,
  IconSearch,
  IconSpinner,
} from '@/components/ui/icons/next-icons'

type SecondSidebarProps = {
  items: SidebarItem[]
  open: boolean
  pathname: string
  setItems: (items: SidebarItem[]) => void
  setOpen: (open: boolean) => void
  setSecondSidebar: (value?: string) => void
  secondSidebar?: SidebarFoldersProps
}

interface ItemToDelete {
  id: string
  name?: string
}

export const SecondSidebar = (props: SecondSidebarProps) => {
  const { items, secondSidebar, setItems, open, setOpen, pathname, setSecondSidebar } =
    props

  const sidebarRef = useRef(null)

  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>(items)
  const [searchValue, setSearchValue] = useState('')

  const [showNewItem, setShowNewItem] = useState(false)
  const [nameNewItem, setNameNewItem] = useState('')
  const [showNewItemButton, setShowNewItemButton] = useState(false)

  const [loading, setLoading] = useState(false)

  // Inside SecondSidebar component
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null)

  const handleDelete = (id: string, name: string = '') => {
    setItemToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (
        sidebarRef.current &&
        !(sidebarRef.current as HTMLElement).contains(event.target)
      ) {
        setShowNewItem(false) // Closes the new folder input
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarRef])

  const onUpdateFolderName = async (id: string, newName: string) => {
    setLoading(true)
    try {
      await updateCollection({
        collectionId: id,
        name: newName,
        description: '',
      })
      console.log(items)

      const elements = items.map((element) => {
        if (element.id === id) {
          return {
            ...element,
            name: newName,
          }
        }
        return element
      })
      setFilteredItems(elements)
      setItems(elements)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      // Implement your update logic here
      setIsEditing({ ...isEditing, [id]: false })
    }
  }

  const onDuplicate = (id: string) => {}

  const confirmDelete = async () => {
    setLoading(true)
    const itemId = itemToDelete?.id

    if (!itemId) {
      setLoading(false)
      setDeleteDialogOpen(false)
      return
    }

    try {
      await deleteCollection({
        collectionId: itemId,
      })

      const elements = items.filter((element) => element.id !== itemId)
      setFilteredItems(elements)
      setItems(elements)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  const onFilterItems = (value: any) => {
    const searchitems = items.filter((item: any) => {
      return item.name.toLowerCase().includes(value.toLowerCase())
    })
    const noresults = value.length > 0 && searchitems.length === 0
    setShowNewItemButton(noresults)

    setFilteredItems(searchitems)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, callback: Function) => {
    if (event.key === 'Enter') {
      callback()
    }
  }

  const onSaveNewItem = async () => {
    setLoading(true)
    try {
      const response = await createCollection({
        name: nameNewItem,
        userId: '',
        description: '',
      })

      if ('id' in response && 'name' in response && 'description' in response) {
        const item: SidebarItem = response
        const elements = [
          {
            id: item.id,
            name: item.name,
            description: item.description,
            url: `/folder/${item.id}`,
          },
          ...items,
        ]
        setFilteredItems(elements)
        setItems(elements)
      } else {
        // Handle error case
        const error = response
        console.error('Error creating item:', error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setNameNewItem('')
      setShowNewItem(false)
    }
  }

  if (loading) {
    return <IconSpinner />
  }

  return (
    <div
      ref={sidebarRef}
      className={`absolute top-0 left-12 ml-1 h-full flex flex-col flex-shrink-0
        bg-background overflow-hidden transition-all duration-3 ease-in-out shadow-md
       opacity-0
        ${open ? 'w-[204px] opacity-100' : 'w-[0px]'}
      `}>
      <div className={`flex flex-col flex-1 w-full border-t border-l`}>
        <div className='flex flex-col gap-1'>
          <div className='pr-4 pl-2 py-2 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='icon' onClick={() => setSecondSidebar()}>
                <ChevronLeftIcon />
              </Button>
              <span className='flex-1 overflow-hidden whitespace-nowrap capitalize'>
                {secondSidebar?.name} - {items.length}
              </span>
            </div>
            <DropdownMenu setShowNewItem={setShowNewItem} />
          </div>
          <div className='flex w-full items-center relative'>
            <Input
              id='search'
              className='flex-1 border-[1px] mx-2 px-2'
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                onFilterItems(e.target.value)
              }}
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

          {showNewItem && (
            <div className='mx-2 ml-4 mt-2 pb-2 flex items-center'>
              <IconFolder />
              <Input
                id='name'
                className='file:font-normal text-xs ml-2 flex-1 bg-white border-[1px] disabled:bg-gray-100 disabled:text-gray-400'
                value={nameNewItem}
                onChange={(e) => setNameNewItem(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, onSaveNewItem)}
                placeholder='Name'
              />
              <button
                onClick={() => {
                  setShowNewItem(false)
                  setNameNewItem('')
                }}
                className=''>
                <IconCancel />
              </button>
            </div>
          )}
          {showNewItemButton && (
            <div className='mx-4 mt-2 pb-2 flex items-center w-full'>
              <Button
                onClick={() => {
                  setShowNewItem(true)
                  setShowNewItemButton(false)
                  setNameNewItem(searchValue)
                }}
                className='text-xs font-normal'>
                <IconPlus className='mr-2' />
                Create folder
              </Button>
            </div>
          )}
        </div>

        <nav className={`flex flex-col w-full flex-shrink-0 flex-1 mt-1`}>
          {filteredItems && (
            <ScrollArea className='flex-1 flex flex-col max-h-[80vh] border-r-0 py-1 px-2'>
              {filteredItems.map((item) => (
                <NestedItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  onUpdateFolderName={onUpdateFolderName}
                  onDuplicate={onDuplicate}
                  handleDelete={handleDelete}
                  setItems={setItems}
                  setOpen={setOpen}
                />
              ))}
            </ScrollArea>
          )}
          {!loading && filteredItems && filteredItems.length === 0 && (
            <div className='h-14 flex items-center justify-center'>No items</div>
          )}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this folder?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className='items-center'>
                <Button onClick={() => confirmDelete()}>Delete</Button>
                <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </div>
  )
}

const DropdownMenu = ({ setShowNewItem }: { setShowNewItem: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative inline-block text-left'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='inline-flex justify-center w-full py-2 text-sm font-medium text-gray-700'>
        <IconDotsVertical />
      </button>

      {isOpen && (
        <div className='absolute z-50 right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div
            className='py-1 items-center justify-center'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'>
            <Button
              onClick={() => {
                setShowNewItem(true)
                setIsOpen(!isOpen)
              }}
              className='block border-b w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
              variant='ghost'>
              Create new folder
            </Button>
            {/* TO-DO v1
            <Button
              onClick={() => {
                setIsOpen(!isOpen)
              }}
              className="block w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              variant="ghost"
            >
              Show Folders Tutorial
            </Button>*/}
          </div>
        </div>
      )}
    </div>
  )
}
