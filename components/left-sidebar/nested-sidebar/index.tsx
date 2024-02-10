import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { useToast } from '@/components/ui/use-toast'
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
  nestedSidebar: NestedSidebarProps
  setNestedSidebar: (value?: string) => void
  setItemListByCategory: (value: ItemListByCategory) => void
}

interface ItemToDelete {
  id: string
  name?: string
}

export const NestedSidebar = (props: SecondSidebarProps) => {
  const {
    itemListByCategory,
    nestedSidebar,
    pathname,
    setNestedSidebar,
    setItemListByCategory,
  } = props

  const router = useRouter()
  const { toast } = useToast()

  const [itemsList, setItemsList] = useState<SidebarItem[]>([])
  const [loading, setLoading] = useState(true)

  const [createInProgress, setCreateInProgress] = useState(false)
  const [createNewItemButton, setCreateNewItemButton] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<SidebarItem | null>(null)

  useEffect(() => {
    const { entity } = nestedSidebar

    if (itemListByCategory && Array.isArray(itemListByCategory[entity])) {
      setItemsList(itemListByCategory[entity])
      setLoading(false)
    }
  }, [nestedSidebar, itemListByCategory])

  const onDelete = (item: SidebarItem) => {
    console.log(item)
    setItemToDelete(item)
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

      updateItemListCallback(updatedItemList)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      // Implement your update logic here
    }
  }

  const onDuplicate = (id: string) => {}

  const confirmDelete = async () => {
    if (!itemToDelete?.id) {
      setDeleteDialogOpen(false)
      return
    }

    const { id: itemId, name } = itemToDelete
    setLoading(true)

    try {
      await deleteCollection({
        collectionId: itemId,
      })

      const remainingItems = itemsList.filter((item) => item.id !== itemId)
      updateItemListCallback(remainingItems)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)

      const itemType = nestedSidebar.name.substring(0, nestedSidebar.name.length - 1)
      toast({
        title: `${itemType} deleted`,
        description: `${name} has been deleted`,
      })
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
        updateItemListCallback(newItemList)
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

  const updateItemListCallback = useCallback(
    (newItemList: SidebarItem[]) => {
      // setItemsList(newItemList)

      // @ts-ignore
      setItemListByCategory((prev) => {
        return {
          ...prev,
          [nestedSidebar.entity]: newItemList,
        }
      })
    },
    [nestedSidebar, setItemListByCategory],
  )

  return (
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
        <IconSpinner className='self-center mt-24 h-6 w-6 text-foreground/50' />
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
                onDelete={onDelete}
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
              setCreateNewItemButton(false)
            }}
          >
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
              Are you sure you want to delete <strong>{itemToDelete?.name}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='items-center'>
            <Button variant='destructive' onClick={() => confirmDelete()}>
              Delete
            </Button>
            <Button variant='secondary' onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
