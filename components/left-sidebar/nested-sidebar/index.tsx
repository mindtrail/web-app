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
import { Separator } from '@/components/ui/separator'

type SecondSidebarProps = {
  activeNestedSidebar: NestedSidebarItem
  itemListByCategory?: ItemListByCategory
  pathname: string
  setActiveNestedSidebar: (value?: string) => void
  setItemListByCategory: (value: ItemListByCategory) => void
}

export const NestedSidebar = (props: SecondSidebarProps) => {
  const {
    activeNestedSidebar,
    itemListByCategory,
    pathname,
    setActiveNestedSidebar,
    setItemListByCategory,
  } = props

  const router = useRouter()
  const { toast } = useToast()

  const [allItems, setAllItems] = useState<SidebarItem[]>([])
  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>([])
  const [loading, setLoading] = useState(true)

  const [searchValue, setSearchValue] = useState('')
  const [createItemfromSearchValue, setCreateItemFromSearchValue] = useState(false)

  const [opInProgress, setOpInProgress] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<SidebarItem | null>(null)

  useEffect(() => {
    const { entityType } = activeNestedSidebar

    if (itemListByCategory && Array.isArray(itemListByCategory[entityType])) {
      setAllItems(itemListByCategory[entityType])
      setFilteredItems(itemListByCategory[entityType])
      setLoading(false)
    }
  }, [activeNestedSidebar, itemListByCategory])

  const onDelete = (item: SidebarItem) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const onUpdateFolderName = async (id: string, newName: string) => {
    try {
      await updateCollection({
        collectionId: id,
        name: newName,
        description: '',
      })

      const updatedItemList = filteredItems.map((item) => {
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
      // Implement your update logic here
    }
  }

  // @TODO: Implement this
  const onDuplicate = (id: string) => {}

  const confirmDelete = async () => {
    if (!itemToDelete?.id) {
      setDeleteDialogOpen(false)
      return
    }

    const { id: itemId, name } = itemToDelete

    try {
      await deleteCollection({
        collectionId: itemId,
      })

      const remainingItems = filteredItems.filter((item) => item.id !== itemId)
      updateItemListCallback(remainingItems)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setDeleteDialogOpen(false)

      const itemType = activeNestedSidebar.name.substring(
        0,
        activeNestedSidebar.name.length - 1,
      )
      toast({
        title: `${itemType} deleted`,
        description: `${name} has been deleted`,
      })
    }
  }

  const onFilterItems = (value: string = '') => {
    if (!allItems?.length) {
      return
    }

    if (!value) {
      setSearchValue('')
      setFilteredItems(allItems)
      setCreateItemFromSearchValue(false)
      return
    }

    setSearchValue(value)

    value = value.toLowerCase()
    const filterResult = allItems.filter((item: any) =>
      item.name.toLowerCase().includes(value),
    )

    setFilteredItems(filterResult)
    setCreateItemFromSearchValue(!filterResult?.length)
  }

  const onSaveNewItem = async (name: string) => {
    setOpInProgress(true)

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
        const newItemList = [newItem, ...filteredItems]

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
      setOpInProgress(false)
      if (createItemfromSearchValue) {
        setSearchValue('')
        setCreateItemFromSearchValue(false)
      }
    }
  }

  const updateItemListCallback = useCallback(
    (newItemList: SidebarItem[]) => {
      // setFilteredItems(newItemList)

      // @ts-ignore
      setItemListByCategory((prev) => {
        return {
          ...prev,
          [activeNestedSidebar.entityType]: newItemList,
        }
      })
    },
    [activeNestedSidebar, setItemListByCategory],
  )

  const itemsCount =
    filteredItems?.length === allItems?.length
      ? filteredItems?.length.toString()
      : `${filteredItems?.length} / ${allItems?.length}`

  return (
    <div className={`flex flex-col flex-1 w-full border-t border-l`}>
      <NestedTopSection
        searchValue={searchValue}
        activeNestedSidebar={activeNestedSidebar}
        itemsCount={itemsCount}
        opInProgress={opInProgress}
        onSaveNewItem={onSaveNewItem}
        onFilterItems={onFilterItems}
        setActiveNestedSidebar={setActiveNestedSidebar}
      />

      {loading ? (
        <IconSpinner className='self-center mt-24 h-6 w-6 text-foreground/50' />
      ) : (
        <nav className='h-full'>
          {/* Viewport height - Top and bottom areas */}
          <ScrollArea className='flex flex-col max-h-[calc(100vh-277px)] px-2 pt-3 pb-1 gap-1'>
            {/* Added this as a spacer, to have all the border visible on editing */}
            <Separator className='bg-transparent h-[2px]' />

            {filteredItems.map((item) => (
              <NestedItem
                key={item.id}
                item={item}
                pathname={pathname}
                activeNestedSidebar={activeNestedSidebar}
                onUpdateFolderName={onUpdateFolderName}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}

            <Separator className='bg-transparent h-[2px]' />
          </ScrollArea>

          {!filteredItems?.length && (
            <span className='absolute top-32 w-full text-center text-foreground/75'>
              No items
            </span>
          )}
        </nav>
      )}

      {createItemfromSearchValue && (
        <div className='absolute top-48 px-2 flex items-center w-full max-w-full'>
          <Button
            className='gap-1 flex-1 max-w-full'
            disabled={opInProgress}
            onClick={() => onSaveNewItem(searchValue)}
          >
            {opInProgress ? (
              <IconSpinner className='shrink-0' />
            ) : (
              <PlusIcon className='shrink-0' width={16} height={16} />
            )}

            <span className='truncate'>
              {opInProgress ? 'Creating' : 'Create'} {searchValue}
            </span>
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
