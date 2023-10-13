'use client'
import { useState, MouseEvent, KeyboardEvent, useEffect } from 'react'
import { DataSrc } from '@prisma/client'
import { Document } from 'langchain/document'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSpinner } from '@/components/ui/icons'
import Typography from '@/components/typography'

type HistoryLookupProps = {
  userId: string
  historyItems: DataSrc[]
}

type SearchResult = Document['metadata'] & {
  image: string
  summary: string
}

const getRouteWithoutProtocol = (url: string) => {
  const match = url.match(/^https?:\/\/([^:]+)([^?]+)?/)
  return match ? match[1] + (match[2] || '') : ''
}

export function Search({ userId, historyItems }: HistoryLookupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [processing, setProcessing] = useState(false)
  const [history, setHistory] = useState<DataSrc[]>([])
  const [foundWebsite, setFoundWebsite] = useState<SearchResult>()

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(event)
    }
  }

  useEffect(() => {
    const updatedItems = historyItems.map((item) => {
      return {
        ...item,
        name: getRouteWithoutProtocol(item.name),
      }
    })
    setHistory(updatedItems)
  }, [historyItems])

  const handleSearch = async (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault()
    setProcessing(true)

    try {
      const result = await fetch('/api/history', {
        method: 'POST',
        body: JSON.stringify({ userId, searchQuery: searchQuery.trim() }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const websites = await result.json()
      setProcessing(false)
      setFoundWebsite(websites)
    } catch (e) {
      console.log('error', e)
      setProcessing(false)
    }
  }

  // return <div>Chat Page</div>
  return (
    <div className='flex flex-col flex-1 w-full  px-4 py-4 md:py-8 md:px-8 gap-4'>
      <Typography variant='h4' className='mb-4 text-gray-700'>
        Search any information
      </Typography>
      <div className='flex gap-4 w-full items-center'>
        <Input
          id='search'
          className='flex-1 bg-white border-[1px] disabled:bg-gray-100 disabled:text-gray-400 px-2'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='A website about travel'
        />
        <Button onClick={handleSearch} disabled={!searchQuery}>
          {processing && <IconSpinner className='mr-2' />}
          Search
        </Button>
      </div>
      <div className='w-full max-w-2xl flex flex-col flex-1 gap-6 pt-6'>
        {processing && (
          <div className='flex gap-4 items-center'>
            Searching for a match...
          </div>
        )}

        {foundWebsite ? (
          <div className='flex flex-col gap-4'>
            <Link href={foundWebsite?.fileName}>
              <Typography variant='h5' className='text-gray-600 capitalize'>
                {foundWebsite?.hostName}
              </Typography>
            </Link>
            <Typography variant='p' className='text-gray-600'>
              {foundWebsite?.summary}
            </Typography>
            <Link href={foundWebsite?.fileName}>
              <img
                alt={foundWebsite?.metaDescription}
                src={foundWebsite?.image}
              />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
