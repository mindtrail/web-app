import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ChevronLeftIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'

import { Input } from '@/components/ui/input'
import { IconSearch } from '@/components/ui/icons/next-icons'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { useToast } from '@/components/ui/use-toast'
import { Typography } from '@/components/typography'
import { ItemInput } from '@/components/left-sidebar/item-input'

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
import { Separator } from '@/components/ui/separator'

type SecondSidebarProps = {
  activeNestedSidebar: NestedSidebarItem
  nestedItemsByCategory?: NestedItemsByCategory
  pathname: string
  setActiveNestedSidebar: (value?: string) => void
  setNestedItemsByCategory: (value: SetNestedItemByCat) => void
}

export const NestedSidebar = (props: SecondSidebarProps) => {
  const {
    activeNestedSidebar,
    nestedItemsByCategory,
    pathname,
    setActiveNestedSidebar,
    setNestedItemsByCategory,
  } = props

  const router = useRouter()
  const { toast } = useToast()

  const { entityType, name: sidebarName } = activeNestedSidebar

  const [allItems, setAllItems] = useState<SidebarItem[]>([])
  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>([])
  const [loading, setLoading] = useState(true)

  const [newItemName, setNewItemName] = useState('')
  const [newItemInputVisible, setNewItemInputVisible] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [createItemfromSearchValue, setCreateItemFromSearchValue] = useState(false)

  const [opInProgress, setOpInProgress] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<SidebarItem | null>(null)

  useEffect(() => {
    if (nestedItemsByCategory && Array.isArray(nestedItemsByCategory[entityType])) {
      setAllItems(nestedItemsByCategory[entityType])
      setFilteredItems(nestedItemsByCategory[entityType])
      setLoading(false)
    }
  }, [entityType, nestedItemsByCategory])

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

  const onFilterItems = useCallback(
    (value: string = '') => {
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
    },
    [allItems],
  )

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
        setNewItemInputVisible(false)
        setCreateItemFromSearchValue(false)
      }
    }
  }

  const updateItemListCallback = useCallback(
    (newItemList: SidebarItem[]) => {
      // setFilteredItems(newItemList)

      // @ts-ignore
      setNestedItemsByCategory((prev) => {
        return {
          ...prev,
          [activeNestedSidebar.entityType]: newItemList,
        }
      })
    },
    [activeNestedSidebar, setNestedItemsByCategory],
  )

  const itemsCount =
    filteredItems?.length === allItems?.length
      ? filteredItems?.length.toString()
      : `${filteredItems?.length} / ${allItems?.length}`

  return (
    <div className={`flex flex-col flex-1 w-full border-t border-l`}>
      <div className='Header px-2 py-2 flex justify-between items-center'>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon' onClick={() => setActiveNestedSidebar()}>
            <ChevronLeftIcon width={16} height={16} />
          </Button>
          <span className='flex-1 overflow-hidden whitespace-nowrap capitalize'>
            {activeNestedSidebar?.name} ({itemsCount})
          </span>
        </div>

        <Button
          className='invisible group-hover:visible'
          variant='ghost'
          size='icon'
          onClick={() => {
            setNewItemInputVisible(true)
            setNewItemName('')
          }}
        >
          <PlusIcon width={16} height={16} />
        </Button>
      </div>
      <div className='Search flex w-full items-center relative'>
        <Input
          id='search'
          className='mx-2'
          value={searchValue}
          onChange={(e) => onFilterItems(e?.target?.value)}
          placeholder='Search'
        />

        {!searchValue ? (
          <IconSearch className='absolute right-4 opacity-50' />
        ) : (
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-2'
            onClick={() => onFilterItems('')}
          >
            <Cross2Icon />
          </Button>
        )}
      </div>

      {newItemInputVisible && (
        <div className='pt-4 -mt-[2px] -mb-2 px-2'>
          <ItemInput
            itemName={newItemName}
            opInProgress={opInProgress}
            entityType={entityType}
            setItemName={setNewItemName}
            setInputVisibility={setNewItemInputVisible}
            callbackFn={onSaveNewItem}
          />
        </div>
      )}

      {loading ? (
        <IconSpinner className='self-center mt-24 h-6 w-6 text-foreground/50' />
      ) : (
        <div className='flex-1 flex flex-col px-2 pt-3 pb-1'>
          <nav>
            <ScrollArea className='flex flex-col gap-1 max-h-[calc(100vh-277px)] '>
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
          </nav>

          {!filteredItems?.length && !createItemfromSearchValue && (
            <div className='flex flex-col w-full gap-4'>
              <Typography className='py-4 self-center'>No Items</Typography>
              <Button
                className='flex gap-2'
                disabled={opInProgress}
                onClick={() => onSaveNewItem(searchValue)}
              >
                {opInProgress ? (
                  <IconSpinner className='shrink-0' />
                ) : (
                  <PlusIcon className='shrink-0' width={16} height={16} />
                )}

                <span className='truncate'>
                  {opInProgress ? 'Creating' : 'Create'} {entityType}
                </span>
              </Button>
            </div>
          )}
        </div>
      )}

      {createItemfromSearchValue && (
        <div className='absolute top-24 mt-2 px-2 flex w-full z-10'>
          <Button
            className='flex flex-1 gap-2 justify-start max-w-full'
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
