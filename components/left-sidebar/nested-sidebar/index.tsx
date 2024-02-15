import { useEffect, useCallback, useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { ChevronLeftIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { useToast } from '@/components/ui/use-toast'
import { Typography } from '@/components/typography'
import { NestedItemInput } from '@/components/left-sidebar/nested-sidebar/item-input'

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
import { createTag, deleteTag, updateTag } from '@/lib/serverActions/tag'

import { NestedItem } from './nested-item'
import { Separator } from '@/components/ui/separator'

type SecondSidebarProps = {
  activeNestedSidebar: NestedSidebarItem
  nestedItemsByCategory?: NestedItemsByCategory
  pathname: string
  setActiveNestedSidebar: (value?: string) => void
  setNestedItemsByCategory: (value: SetNestedItemByCat) => void
}

type CrudParams = {
  id: string
  name: string
}

const CRUD_OPERATIONS = {
  folder: {
    create: createCollection,
    delete: ({ id }: CrudParams) => deleteCollection({ collectionId: id }),
    update: ({ id, name }: CrudParams) => updateCollection({ collectionId: id, name }),
  },
  tag: {
    create: createTag,
    delete: ({ id }: CrudParams) => deleteTag({ tagId: id }),
    update: ({ id, name }: CrudParams) => updateTag({ tagId: id, name }),
  },
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

  const entityType = activeNestedSidebar.entityType as 'folder' | 'tag'

  const [allItems, setAllItems] = useState<SidebarItem[]>([])
  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>([])
  const [loading, setLoading] = useState(true)

  const [newName, setNewName] = useState('')
  const [newItemInputVisible, setNewItemInputVisible] = useState(false)
  const [opInProgress, setOpInProgress] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  const [createItemfromSearchValue, setCreateItemFromSearchValue] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<SidebarItem | null>(null)

  const crudOperation = useCallback(
    (operation: 'create' | 'delete' | 'update', payload: any) => {},
    [],
  )

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

  const onCreateItem = async () => {
    setOpInProgress(true)

    const newElementName = createItemfromSearchValue
      ? searchValue
      : newName || 'New' + entityType

    try {
      const response = await CRUD_OPERATIONS[entityType].create({ name: newElementName })

      // @TODO: improve this
      if ('id' in response) {
        const newItem = {
          id: response.id as string,
          name: newElementName,
          url: `/${entityType}/${response.id}`,
        }

        const newItemList = [newItem, ...allItems]
        setNestedItemsByCategory({ entityType, items: newItemList })
        return router.push(newItem.url)
      } else {
        // Handle error case
        console.error('Error creating item:', response)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setOpInProgress(false)
      setNewItemInputVisible(false)

      if (createItemfromSearchValue) {
        setSearchValue('')
        setCreateItemFromSearchValue(false)
      }
    }
  }

  const onRename = useCallback(
    async (id: string, newName: string) => {
      if (newName.length < 3) {
        toast({
          variant: 'destructive',
          title: 'Please enter a name',
          description: 'Name must be at least 3 characters',
        })
        return
      }

      setOpInProgress(true)

      try {
        await CRUD_OPERATIONS[entityType].update({ id, name: newName })

        const updatedList = allItems.map((item) =>
          item.id === id ? { ...item, name: newName } : item,
        )
        setNestedItemsByCategory({ entityType, items: updatedList })
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setOpInProgress(false)
      }
    },
    [entityType, allItems, setNestedItemsByCategory, toast],
  )

  // @TODO: Implement this
  const onDuplicate = (id: string) => {}

  const confirmDelete = async () => {
    const id = itemToDelete?.id

    if (!id) {
      setDeleteDialogOpen(false)
      return
    }
    setDeleteDialogOpen(false)
    setOpInProgress(true)

    try {
      await CRUD_OPERATIONS[entityType].delete({ id, name: '' })

      const remainingItems = allItems.filter((item) => item.id !== id)
      setNestedItemsByCategory({ entityType, items: remainingItems })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setOpInProgress(false)

      toast({
        title: `${entityType} deleted`,
        description: `${itemToDelete?.name} has been deleted`,
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

  const handleSearchKeydown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      return onCreateItem()
    }

    if (event.key === 'Escape') {
      onFilterItems('')
    }
  }

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
          <Typography
            variant='small-semi'
            className='flex-1 overflow-hidden whitespace-nowrap capitalize'
          >
            {activeNestedSidebar?.name} ({itemsCount})
          </Typography>
        </div>

        <Button
          className='invisible group-hover:visible'
          variant='ghost'
          size='icon'
          onClick={() => {
            setNewItemInputVisible(true)
            setNewName('')
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
          onKeyDown={handleSearchKeydown}
          placeholder='Search or create...'
        />

        {!searchValue ? (
          <MagnifyingGlassIcon className='absolute right-4 h-4 w-4 shrink-0 opacity-50' />
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
          <NestedItemInput
            newName={newName}
            opInProgress={opInProgress}
            entityType={entityType}
            setNewName={setNewName}
            setInputVisibility={setNewItemInputVisible}
            callbackFn={onCreateItem}
          />
        </div>
      )}

      {loading ? (
        <IconSpinner className='self-center mt-24 h-6 w-6 text-foreground/50' />
      ) : (
        <div className='flex-1 flex flex-col px-2 pt-3 pb-1'>
          <nav>
            <ScrollArea className='flex flex-col max-h-[calc(100vh-216px)] '>
              {/* Added this as a spacer, to have all the border visible on editing */}
              <Separator className='bg-transparent h-[2px]' />

              {filteredItems.map((item) => (
                <NestedItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  opInProgress={opInProgress}
                  activeNestedSidebar={activeNestedSidebar}
                  onRename={onRename}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                />
              ))}

              <Separator className='bg-transparent h-[2px]' />
            </ScrollArea>
          </nav>

          {!filteredItems?.length &&
            !createItemfromSearchValue &&
            !newItemInputVisible && (
              <div className='flex flex-col w-full gap-4'>
                <Typography className='py-4 self-center'>No Items</Typography>
                <Button
                  className='flex gap-2'
                  disabled={opInProgress}
                  onClick={() => {
                    setNewItemInputVisible(true)
                    setNewName('')
                  }}
                >
                  {opInProgress ? (
                    <IconSpinner className='shrink-0' />
                  ) : (
                    <PlusIcon className='shrink-0' width={16} height={16} />
                  )}

                  <span className='truncate'>
                    {opInProgress ? 'Creating' : 'New'} {entityType}
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
            variant='ghost'
            onClick={onCreateItem}
          >
            {opInProgress ? (
              <IconSpinner className='shrink-0' />
            ) : (
              <PlusIcon className='shrink-0' width={16} height={16} />
            )}

            <span className='truncate'>
              {opInProgress ? 'Creating' : 'Create'} <strong>{searchValue}</strong>
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
