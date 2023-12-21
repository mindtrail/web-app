'use client'
import { useState, MouseEvent, KeyboardEvent, useEffect } from 'react'
import { Document } from 'langchain/document'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { Typography } from '@/components/typography'
import { addHttpsIfMissing } from '@/lib/utils'

type WebsiteSearchResult = Document['metadata'] | null

type HistoryLookupProps = {
  userId: string
}

export function Search({ userId }: HistoryLookupProps) {
  const [searchPerfromed, setSearchPerfromed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [processing, setProcessing] = useState(false)
  const [foundWebsite, setFoundWebsite] = useState<WebsiteSearchResult>()

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(event)
    }
  }

  const handleSearch = async (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault()
    setProcessing(true)

    const result = await fetch('/api/history', {
      method: 'POST',
      body: JSON.stringify({ userId, searchQuery: searchQuery.trim() }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const websites = await result.json()

    setFoundWebsite(websites)
    setProcessing(false)
    setSearchPerfromed(true)
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
          Search
        </Button>
      </div>
      <div className='w-full max-w-2xl flex flex-col flex-1 gap-6 pt-6'>
        {processing && (
          <div className='flex gap-2 items-center'>
            Searching for a match...
            {processing && <IconSpinner className='' />}
          </div>
        )}

        {foundWebsite?.summary ? (
          <div className='flex flex-col gap-4'>
            <Link href={addHttpsIfMissing(foundWebsite?.name)}>
              <Typography variant='h5' className='text-gray-600'>
                {foundWebsite?.hostName}
              </Typography>
            </Link>
            <Link href={addHttpsIfMissing(foundWebsite?.name)}>
              <img
                alt={foundWebsite?.description}
                src={foundWebsite?.image}
              />
            </Link>
          </div>
        ) : searchPerfromed ? (
          <>No results found</>
        ) : null}
      </div>
    </div>
  )
}
