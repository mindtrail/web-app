'use client'

import { MouseEvent, useCallback, useMemo, useState } from 'react'

import { deleteDataSource } from '@/lib/serverActions/history'
import { useDrop } from 'react-dnd'
import { DataSourceType, UserPreferences } from '@prisma/client'

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

import { getURLPathname } from '@/lib/utils'
import { updateUserPreferences } from '@/lib/db/preferences'

type HistoryComponentProps = {
  historyMetadata: { name: string; parent: string },
  userId: string
  historyItems: HistoryItem[]
  userPreferences?: UserPreferences
}

export function HistoryComponent({
  historyMetadata,
  historyItems,
  userId,
  userPreferences,
}: HistoryComponentProps) {
  const [filteredItems, setFilteredItems] =
    useState<HistoryItem[]>(historyItems)

  const [filters, setFilters] = useState<HistoryFilter[]>()
  const [itemsToDelete, setItemsToDelete] = useState<HistoryItem[] | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [, dropRef] = useDrop({ accept: 'column' })
  const { toast } = useToast()

  const handlePreferenceUpdate = useCallback(
    (newTablePrefs: UserTablePrefs) => {
      if (!newTablePrefs) {
        return
      }

      updateUserPreferences(userId, newTablePrefs)
    },
    [userId],
  )

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

    const deletedItems = itemsToDelete
      .map(({ displayName = '' }) => displayName)
      .join(', ')

    const dataSourceIdList = itemsToDelete.map(({ id }) => id)

    try {
      await deleteDataSource({ dataSourceIdList })
      toast({
        title: 'Delete History Entry',
        description: `${deletedItems} has been deleted`,
      })

      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${deletedItems}`,
      })
      console.log(err)

      setDeleteDialogOpen(false)
      setItemsToDelete(null)
    }
  }, [itemsToDelete, toast])

  const deleteItemsList = useMemo(
    () =>
      itemsToDelete?.length &&
      itemsToDelete.map(({ displayName = '', name, type }, index) => (
        <li
          key={index}
          className='max-w-[85%] overflow-hidden whitespace-nowrap text-ellipsis'
        >
          {type === DataSourceType.file
            ? displayName
            : displayName + getURLPathname(name)}
        </li>
      )),
    [itemsToDelete],
  )

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setFilteredItems(historyItems)
        return
      }
      setProcessing(true)

      const result = await fetch('/api/history', {
        method: 'POST',
        body: JSON.stringify({ userId, searchQuery: searchQuery.trim() }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const dataSourceList = await result.json()
      setFilteredItems(dataSourceList)

      setProcessing(false)
    },
    [userId, historyItems],
  )

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

  return (
    <div
      ref={dropRef}
      className={`flex flex-col flex-1 gap-2 px-4 py-4 md:px-8 md:pt-8
        overflow-auto`}
    >
      <SearchBasic handleSearch={handleSearch} />

      <DataTable
        historyMetadata={historyMetadata}
        data={filteredItems}
        processing={processing}
        userPreferences={userPreferences}
        handleHistoryDelete={handleHistoryDelete}
        updateUserPreferences={handlePreferenceUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent content=''>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription className='break-words'>
              This will delete the history entries and the associated data. The
              action cannot be undone and will permanently delete:
              <span className='block mt-4 mb-2 list-disc list-inside '>
                {deleteItemsList}
              </span>
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
