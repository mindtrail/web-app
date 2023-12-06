'use client'

import {
  MouseEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { deleteDataSource } from '@/lib/serverActions/history'
import { useDrop } from 'react-dnd'
import { Document } from 'langchain/document'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { SearchBasic } from '@/components/search/basic'
import { DataTable } from '@/components/history/table'
import { columns } from '@/components/history/columns'
import { getHostName } from '@/lib/utils'

type Tags = {
  [key: string]: string
}
type WebsiteSearchResult = Document['metadata'] | null

const getRouteWithoutProtocol = (url: string) => {
  const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^?]+)?/)
  const route = match ? match[1] : ''
  return route.replace(/\/$/, '')
}

export function HistoryView({ historyItems, userId }: HistoryViewProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([])

  const [categories, setCategories] = useState<HistoryFilter[]>([])
  const [filters, setFilters] = useState<HistoryFilter[]>()
  const [itemsToDelete, setItemsToDelete] = useState<HistoryItem[] | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [, dropRef] = useDrop({
    accept: 'column',
  })

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
      '\\b' + filters.map((f) => f.value).join('\\s*|\\s*') + '\\b',
    )

    const filteredHistory = history.filter((item) =>
      pattern.test(item?.thumbnail || ''),
    )

    setFilteredItems(filteredHistory)
  }, [filters, history])

  const handleTagListClick = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const newTag = event.currentTarget.dataset.value || ''

    setFilters((prevFilters = []) => {
      const newFilters = prevFilters.filter(
        (prevTag) => prevTag.value !== newTag,
      )

      // Only add the new tag if it wasn't already present (i.e., if the array length is unchanged).
      if (newFilters.length === prevFilters.length) {
        newFilters.push({ value: newTag, label: newTag })
      }

      return newFilters
    })
  }, [])

  const handleHistoryDelete = useCallback((itemsToDelete: HistoryItem[]) => {
    if (!itemsToDelete?.length) {
      return
    }

    setItemsToDelete(itemsToDelete)
    setDeleteDialogOpen(true)
  }, [])

  const confirmHistoryDelete = useCallback(async () => {
    if (!itemsToDelete?.length) {
      return
    }

    const entryNames = itemsToDelete
      .map(({ displayName = '' }) => getHostName(displayName))
      .join(', ')

    try {
      await Promise.all(
        itemsToDelete.map(({ id }) => deleteDataSource({ dataSourceId: id })),
      )

      toast({
        title: 'Delete History Entry',
        description: `${entryNames} has been deleted`,
      })

      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${entryNames}`,
      })
      console.log(err)

      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    }
  }, [itemsToDelete, toast])

  const entryNames = useMemo(
    () =>
      itemsToDelete?.length &&
      itemsToDelete.map(({ displayName = '' }, index) => (
        <li
          key={index}
          className='max-w-[85%] overflow-hidden whitespace-nowrap text-ellipsis'
        >
          {getHostName(displayName)}
        </li>
      )),
    [itemsToDelete],
  )

  const handleSearch = async (searchQuery: string) => {
    setProcessing(true)

    const result = await fetch('/api/history', {
      method: 'POST',
      body: JSON.stringify({ userId, searchQuery: searchQuery.trim() }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const websites = await result.json()
    console.log(222, websites)

    setProcessing(false)
  }

  return (
    <div
      ref={dropRef}
      className={`flex flex-col flex-1 gap-2 px-4 py-4 md:px-8 md:pt-8
        overflow-auto`}
    >
      <SearchBasic handleSearch={handleSearch} />

      <DataTable
        columns={columns}
        data={filteredItems}
        handleHistoryDelete={handleHistoryDelete}
        processing={processing}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent content=''>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription className='break-words'>
              This will delete the history entries and the associated data. The
              action cannot be undone and will permanently delete:
              <ul className='mt-4 mb-2 list-disc list-inside '>{entryNames}</ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='max-w-l'>
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
