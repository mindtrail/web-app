'use client'
import { useState, MouseEvent, KeyboardEvent, useEffect, use } from 'react'
import { DataSrc } from '@prisma/client'
import { GlobeIcon } from '@radix-ui/react-icons'
import { Document } from 'langchain/document'
import Select, { ClearIndicatorProps } from 'react-select'
import Link from 'next/link'

import Typography from '@/components/typography'
import { ScrollArea } from '@/components/ui/scroll-area'

type HistoryLookupProps = {
  userId: string
  historyItems: DataSrc[]
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
  const match = url.match(/^https?:\/\/([^:]+)([^?]+)?/)
  return match ? match[1] + (match[2] || '') : ''
}

export function HistoryLookup({ historyItems }: HistoryLookupProps) {
  const [history, setHistory] = useState<DataSrc[]>([])
  const [categories, setCategories] = useState<TagList[]>([])
  const [categoryFilter, setCategoryFilter] = useState<TagList[]>()

  useEffect(() => {
    const tags: Tags = {}
    const updatedItems = historyItems.map((item) => {
      const elemtnTags = item?.thumbnail?.split(',')
      elemtnTags?.forEach((tag) => {
        const tagKey = tag?.trim()
        tags[tagKey] = tagKey
      })

      return {
        ...item,
        name: getRouteWithoutProtocol(item.name),
      }
    })
    setHistory(updatedItems)

    const tagList = Object.keys(tags).map((tag) => ({ label: tag, value: tag }))
    setCategories(tagList)
  }, [historyItems])

  useEffect(() => {
    if (!categoryFilter?.length) {
      setHistory(historyItems)
      return
    }
    const selectedTags = categoryFilter?.map((tag) => tag.value) || []

    // Create a regex pattern that accounts for potential spaces
    const pattern = new RegExp('\\b' + selectedTags.join('\\s*|\\s*') + '\\b')

    const filteredHistory = historyItems.filter((item) =>
      pattern.test(item?.thumbnail || ''),
    )

    setHistory(filteredHistory)
  }, [categoryFilter, historyItems])

  return (
    <div className='flex flex-col flex-1 w-full items-center px-4 py-4 md:py-8 md:px-8 gap-4'>
      <div className='flex flex-col gap-4 w-full'>
        <Typography variant='h4' className='mb-4 text-gray-700'>
          Last Visited
        </Typography>
        <Select
          isMulti
          options={categories}
          onChange={(selected) => setCategoryFilter(selected as TagList[])}
        />

        {history.length ? (
          <ScrollArea className='flex-1 flex flex-col gap-2 max-h-[76vh] rounded-md py-4 px-2'>
            <div className='flex flex-col gap-2  cursor-default'>
              {history.map((item, index) => (
                <Link
                  href={item.name}
                  key={index}
                  className='flex gap-2 items-center'
                >
                  <GlobeIcon />
                  {item.name}
                </Link>
              ))}
            </div>
          </ScrollArea>
        ) : null}
      </div>
    </div>
  )
}
