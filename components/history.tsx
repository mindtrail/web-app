'use client'
import { useState, MouseEvent, useCallback, useEffect } from 'react'
import { DataSrc } from '@prisma/client'
import { GlobeIcon } from '@radix-ui/react-icons'
import { Document } from 'langchain/document'
import Select, { ClearIndicatorProps } from 'react-select'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import Typography from '@/components/typography'
import { ScrollArea } from '@/components/ui/scroll-area'

type HistoryList = DataSrc & {
  tags?: string[]
  displayName?: string
}

type HistoryLookupProps = {
  userId: string
  historyItems: HistoryList[]
}

type SearchResult = Document['metadata'] & {
  image: string
  summary: string
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

const addHttpsIfMissing = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}

export function HistoryLookup({ historyItems }: HistoryLookupProps) {
  const [history, setHistory] = useState<HistoryList[]>([])
  const [filteredItems, setFilteredItems] = useState<HistoryList[]>([])

  const [categories, setCategories] = useState<TagList[]>([])
  const [filters, setFilters] = useState<TagList[]>()

  useEffect(() => {
    const tags: Tags = {}
    const processedHistory = historyItems.map((item) => {
      const elemtnTags = item?.thumbnail?.split(',').map((tag) => tag.trim())
      elemtnTags?.forEach((tag) => {
        tags[tag] = tag
      })

      return {
        ...item,
        displayName: getRouteWithoutProtocol(item.name),
        tags: elemtnTags,
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
    const selectedTags = filters?.map((tag) => tag.value) || []

    // Create a regex pattern that accounts for potential spaces
    const pattern = new RegExp('\\b' + selectedTags.join('\\s*|\\s*') + '\\b')

    const filteredHistory = history.filter((item) =>
      pattern.test(item?.thumbnail || ''),
    )

    setFilteredItems(filteredHistory)
  }, [filters, history])

  const handleTagListClick = useCallback((event: MouseEvent, tag: string) => {
    event.preventDefault()
    setFilters((prevFilters) => {
      if (!prevFilters) {
        return [{ label: tag, value: tag }]
      }

      const tagExists = prevFilters?.find((filter) => filter.value === tag)
      if (!tagExists) {
        return [...prevFilters, { label: tag, value: tag }]
      }

      return prevFilters?.filter((filter) => filter.value !== tag)
    })
  }, [])

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
            {filteredItems.map(({ displayName, name, tags }, index) => (
              <Link
                target='_blank'
                href={addHttpsIfMissing(name)}
                key={index}
                className='flex group justify-between items-center'
              >
                <span className='flex gap-2 items-center '>
                  <GlobeIcon className='text-green-500' />
                  <span className=' max-w-lg text-ellipsis overflow-hidden whitespace-nowrap'>
                    {displayName}
                  </span>
                </span>

                <span className='flex items-center gap-2'>
                  {tags?.map((tag, index) => (
                    <Button
                      key={index}
                      variant='secondary'
                      size='sm'
                      className='invisible group-hover:visible hover:bg-secondary/80'
                      onClick={(event) => handleTagListClick(event, tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}
