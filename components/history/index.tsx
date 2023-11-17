'use client'

import { MouseEvent, useCallback, useEffect, useState } from 'react'
import Select from 'react-select'

import { DataSrc } from '@prisma/client'

import { deleteDataSrc } from '@/lib/serverActions/history'

import { HistoryEntry } from '@/components/history/entry'
import { SearchBar } from '@/components/search-bar'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'

type HistoryItem = DataSrc & {
  tags?: string[]
  displayName?: string
}

type HistoryViewProps = {
  userId: string
  historyItems: HistoryItem[]
  // serverCall: () => void
}

type TagList = {
  label: string
  value: string
}

type Tags = {
  [key: string]: string
}

const getRouteWithoutProtocol = (url: string) => {
  const match = url.match(/^(?:https?:\/\/)?([^?]+)?/)
  return match ? match[1] : ''
}

export function HistoryView({ historyItems }: HistoryViewProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([])

  const [categories, setCategories] = useState<TagList[]>([])
  const [filters, setFilters] = useState<TagList[]>()
  const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const tags: Tags = {}
    const processedHistory = historyItems.map((item) => {
      const elementTags =
        item?.thumbnail?.split(',').map((tag) => tag.trim()) || []

      elementTags?.forEach((tag) => {
        tags[tag] = tag
      })

      return {
        ...item,
        displayName: getRouteWithoutProtocol(item.name),
        tags: elementTags,
      } as HistoryItem
    })

    const tagList = Object.keys(tags).map((tag) => ({
      label: tag,
      value: tag,
    }))
    setCategories(tagList)

    setHistory([...processedHistory])
  }, [historyItems])

  useEffect(() => {
    if (!filters?.length) {
      setFilteredItems(history)
      return
    }

    // Create a regex pattern that accounts for potential spaces
    const pattern = new RegExp(
      '\\b' + filters.map((f) => f.value).join('\\s*|\\s*') + '\\b'
    )

    const filteredHistory = history.filter((item) =>
      pattern.test(item?.thumbnail || '')
    )

    setFilteredItems(filteredHistory)
  }, [filters, history])

  const handleTagListClick = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const newTag = event.currentTarget.dataset.value || ''

    setFilters((prevFilters = []) => {
      const newFilters = prevFilters.filter(
        (prevTag) => prevTag.value !== newTag
      )

      // Only add the new tag if it wasn't already present (i.e., if the array length is unchanged).
      if (newFilters.length === prevFilters.length) {
        newFilters.push({ value: newTag, label: newTag })
      }

      return newFilters
    })
  }, [])

  const handleHistoryDelete = useCallback(
    (event: MouseEvent<HTMLElement>, historyItem: HistoryItem) => {
      event.preventDefault()

      if (!historyItem) {
        return
      }
      setItemToDelete(historyItem)
      setDeleteDialogOpen(true)
    },
    []
  )

  const confirmHistoryDelete = useCallback(async () => {
    if (!itemToDelete) {
      return
    }
    const { id, displayName } = itemToDelete

    try {
      await deleteDataSrc({ dataSrcId: id })

      toast({
        title: 'File deleted',
        description: `${displayName} has been deleted`,
      })

      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${displayName}`,
      })
      console.log(err)

      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }, [itemToDelete, toast])

  return (
    <div className='flex flex-1 flex-col gap-4 px-4 py-4 md:px-8 md:py-8'>
      {/* <Typography variant='h4' className='mb-4 text-gray-700'>
        History
      </Typography> */}
      <div className='flex w-full '>
        <Select
          className='flex-1'
          instanceId='history-filter'
          isMulti
          value={filters}
          options={categories}
          onChange={(selected) => setFilters(selected as TagList[])}
        />
      </div>

      {filteredItems.length ? (
        <ScrollArea className='flex max-h-[76vh] min-w-0 flex-1 flex-col gap-2 rounded-md px-2 py-4'>
          <div className='flex max-w-2xl cursor-default flex-col  gap-2'>
            {filteredItems.map((historyItem, index) => (
              <HistoryEntry
                key={index}
                historyItem={historyItem}
                filters={filters}
                handleTagListClick={handleTagListClick}
                handleHistoryDelete={handleHistoryDelete}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the file and the associated data. The action
              cannot be undone and will permanently delete{' '}
              <b>{itemToDelete?.displayName}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={confirmHistoryDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
