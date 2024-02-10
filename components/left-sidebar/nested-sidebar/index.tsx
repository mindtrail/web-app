import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

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
  itemListByCategory?: ItemListByCategory
  pathname: string
  nestedSidebar?: NestedSidebarProps
  setNestedSidebar: (value?: string) => void
}

interface ItemToDelete {
  id: string
  name?: string
}

export const NestedSidebar = (props: SecondSidebarProps) => {
  const { itemListByCategory, nestedSidebar, pathname, setNestedSidebar } = props

  const router = useRouter()

  const [itemsList, setItemsList] = useState<SidebarItem[]>([])
  const [loading, setLoading] = useState(true)

  const [createInProgress, setCreateInProgress] = useState(false)
  const [createNewItemButton, setCreateNewItemButton] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null)

  useEffect(() => {
    if (!nestedSidebar) {
      return
    }

    const { entity } = nestedSidebar
    if (itemListByCategory && Array.isArray(itemListByCategory[entity])) {
      setItemsList(itemListByCategory[entity])
      setLoading(false)
    }
  }, [nestedSidebar, itemListByCategory])

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

      const updatedItemList = itemsList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: newName,
          }
        }
        return item
      })

      // setItems(updatedItemList)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      // Implement your update logic here
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

      const elements = itemsList.filter((item) => item.id !== itemId)
      // setItems(elements)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  const onFilterItems = (value: any) => {
    const searchitems = itemsList.filter((item: any) => {
      return item.name.toLowerCase().includes(value.toLowerCase())
    })
    setItemsList(searchitems)

    const noresults = value.length > 0 && searchitems.length === 0
    if (noresults) {
      setCreateNewItemButton(noresults)
    }
  }

  const onSaveNewItem = async (name: string) => {
    setCreateInProgress(true)

    try {
      const response = await createCollection({
        name,
        userId: '',
        description: '',
      })

      if ('id' in response && 'name' in response && 'description' in response) {
        const { id, name, description } = response
        const newItem = {
          id,
          name,
          description,
          url: `/folder/${response.id}`,
        }

        const newItemList = [newItem, ...itemsList]

        router.push(newItem.url)
        // setItems(newItemList)
      } else {
        // Handle error case
        const error = response
        console.error('Error creating item:', error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCreateInProgress(false)
    }
  }

  return (
    <div
      className={`absolute top-0 left-12 ml-1 h-full flex flex-col
        bg-background overflow-hidden shadow-md opacity-0 group
        transition-all duration-3 ease-in-out

        ${!!nestedSidebar ? 'w-[204px] opacity-100' : 'w-[0px]'}
      `}>
      <div className={`flex flex-col flex-1 w-full border-t border-l gap-2`}>
        <NestedTopSection
          nestedSidebar={nestedSidebar}
          itemsCount={itemsList?.length || 0}
          createInProgress={createInProgress}
          onSaveNewItem={onSaveNewItem}
          onFilterItems={onFilterItems}
          setNestedSidebar={setNestedSidebar}
        />

        {loading ? (
          <IconSpinner />
        ) : (
          <nav className='h-full'>
            {/* Viewport height - Top and bottom areas */}
            <ScrollArea className='flex flex-col max-h-[calc(100vh-277px)] px-2 pb-1'>
              {itemsList.map((item) => (
                <NestedItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  onUpdateFolderName={onUpdateFolderName}
                  onDuplicate={onDuplicate}
                  handleDelete={handleDelete}
                />
              ))}
            </ScrollArea>

            {!itemsList?.length && (
              <div className='h-14 flex items-center justify-center'>No items</div>
            )}
          </nav>
        )}

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
