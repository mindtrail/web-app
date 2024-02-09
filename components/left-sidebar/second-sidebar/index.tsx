import { useEffect, useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { PlusIcon } from '@radix-ui/react-icons'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  createCollection,
  deleteCollection,
  updateCollection,
} from '@/lib/serverActions/collection'

import { NestedItem } from './nested-item'
import { NestedTopSection } from './nested-top'

type SecondSidebarProps = {
  items: SidebarItem[]
  pathname: string
  secondSidebar?: SidebarFoldersProps
  setItems: (items: SidebarItem[]) => void
  setSecondSidebar: (value?: string) => void
}

interface ItemToDelete {
  id: string
  name?: string
}

export const SecondSidebar = (props: SecondSidebarProps) => {
  const { items, secondSidebar, pathname, setItems, setSecondSidebar } = props

  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>(items)
  const [loading, setLoading] = useState(false)

  const [createNewItemButton, setCreateNewItemButton] = useState(false)

  // Inside SecondSidebar component
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null)

  const handleDelete = (id: string, name: string = '') => {
    setItemToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

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
    // setCreateNewItemButton(noresults)

    setFilteredItems(searchitems)
  }

  const onSaveNewItem = async (name: string) => {
    // @TODO: loading for new item....
    try {
      const response = await createCollection({
        name,
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
      // setCreateNewItem(false)
    }
  }

  if (loading) {
    return <IconSpinner />
  }

  return (
    <div
      className={`absolute top-0 left-12 ml-1 h-full flex flex-col flex-shrink-0
        bg-background overflow-hidden transition-all duration-3 ease-in-out shadow-md
       opacity-0 group
        ${!!secondSidebar ? 'w-[204px] opacity-100' : 'w-[0px]'}
      `}>
      <div className={`flex flex-col flex-1 w-full border-t border-l`}>
        <NestedTopSection
          secondSidebar={secondSidebar}
          itemsCount={items?.length || 0}
          onSaveNewItem={onSaveNewItem}
          onFilterItems={onFilterItems}
          setSecondSidebar={setSecondSidebar}
        />

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
                />
              ))}
            </ScrollArea>
          )}
          {!loading && filteredItems && filteredItems.length === 0 && (
            <div className='h-14 flex items-center justify-center'>No items</div>
          )}
        </nav>

        {createNewItemButton && (
          <div className='mx-4 mt-2 pb-2 flex items-center w-full'>
            <Button
              className='gap-2'
              onClick={() => {
                // CREATE NEW ITEM
                // setNewItemName('')
                setCreateNewItemButton(false)
              }}>
              <PlusIcon />
              Create {'new name'}
            </Button>
          </div>
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
      </div>
    </div>
  )
}
