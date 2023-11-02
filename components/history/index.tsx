'use client'
import { useState, MouseEvent, useCallback, useEffect } from 'react'
import { DataSrc } from '@prisma/client'
import Select from 'react-select'

import Typography from '@/components/typography'
import { ScrollArea } from '@/components/ui/scroll-area'

import { HistoryEntry } from '@/components/history/entry'

type HistoryList = DataSrc & {
  tags?: string[]
  displayName?: string
}

type HistoryViewProps = {
  userId: string
  historyItems: HistoryList[]
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
  const [history, setHistory] = useState<HistoryList[]>([])
  const [filteredItems, setFilteredItems] = useState<HistoryList[]>([])

  const [categories, setCategories] = useState<TagList[]>([])
  const [filters, setFilters] = useState<TagList[]>()

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
      } as HistoryList
    })

    const tagList = Object.keys(tags).map((tag) => ({ label: tag, value: tag }))
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

  const handleTagListClick = useCallback(
    (event: MouseEvent, newTag: string) => {
      event.preventDefault()
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
    },
    [],
  )

  return (
    <div className='flex flex-col flex-1 w-full px-4 py-4 md:py-8 md:px-8 gap-4'>
      <Typography variant='h4' className='mb-4 text-gray-700'>
        Categories
      </Typography>
      <Select
        isMulti
        value={filters}
        options={categories}
        onChange={(selected) => setFilters(selected as TagList[])}
      />

      {filteredItems.length ? (
        <ScrollArea className='min-w-0 flex-1 flex flex-col gap-2 max-h-[76vh] rounded-md py-4 px-2'>
          <div className='flex flex-col gap-2 max-w-2xl  cursor-default'>
            {filteredItems.map((historyItem, index) => (
              <HistoryEntry
                key={index}
                historyItem={historyItem}
                filters={filters}
                handleTagListClick={handleTagListClick}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}
