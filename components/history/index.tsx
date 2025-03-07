'use client'

import { useCallback, useState } from 'react'
import { UserPreferences } from '@prisma/client'

import { SearchBasic } from '@/components/search/basic'
import { DataTable } from '@/components/history/table'

import { updateUserPreferencesDbOp } from '@/lib/db/preferences'

type HistoryComponentProps = {
  userId: string
  historyItems: HistoryItem[]
  userPreferences?: UserPreferences
}

export function HistoryComponent({
  historyItems,
  userId,
  userPreferences,
}: HistoryComponentProps) {
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>(historyItems)

  const [processing, setProcessing] = useState(false)

  const handlePreferenceUpdate = useCallback(
    (newTablePrefs: UserTablePrefs) => {
      if (!newTablePrefs) {
        return
      }

      updateUserPreferencesDbOp(userId, newTablePrefs)
    },
    [userId],
  )

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setFilteredItems(historyItems)
        return
      }
      setProcessing(true)

      const result = await fetch(`/api/history?searchQuery=${searchQuery}`)
      const dataSourceList = await result.json()
      setFilteredItems(dataSourceList)

      setProcessing(false)
    },
    [historyItems],
  )

  return (
    <div className={`flex flex-col flex-1 gap-2 px-4 py-4 md:px-8 md:pt-8 overflow-auto`}>
      <SearchBasic handleSearch={handleSearch} />

      <DataTable
        data={filteredItems}
        processing={processing}
        userPreferences={userPreferences}
        handlePreferenceUpdate={handlePreferenceUpdate}
      />
    </div>
  )
}

// const handleTagListClick = useCallback((event: MouseEvent<HTMLElement>) => {
//   event.preventDefault()
//   const newTag = event.currentTarget.dataset.value || ''

//   setFilters((prevFilters = []) => {
//     const newFilters = prevFilters.filter((prevTag) => prevTag.value !== newTag)

//     // Only add the new tag if it wasn't already present (i.e., if the array length is unchanged).
//     if (newFilters.length === prevFilters.length) {
//       newFilters.push({ value: newTag, label: newTag })
//     }

//     return newFilters
//   })
// }, [])
