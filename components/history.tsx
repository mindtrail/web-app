'use client'
import { useState, MouseEvent, KeyboardEvent, useEffect } from 'react'
import { DataSrc } from '@prisma/client'
import { GlobeIcon } from '@radix-ui/react-icons'
import { Document } from 'langchain/document'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconSpinner } from '@/components/ui/icons'
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

const extractRoute = (url: string) => {
  const match = url.match(/^https?:\/\/([^:]+)([^?]+)?/)
  return match ? match[1] + (match[2] || '') : ''
}

export function HistoryLookup({ userId, historyItems }: HistoryLookupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [processing, setProcessing] = useState(false)
  const [history, setHistory] = useState<DataSrc[]>([])
  const [foundWebsite, setFoundWebsite] = useState<SearchResult>()

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(event)
    }
  }

  console.log(historyItems)
  useEffect(() => {
    const updatedItems = historyItems.map((item) => {
      return {
        ...item,
        name: extractRoute(item.name),
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
  console.log('foundWebsite', foundWebsite)

  // return <div>Chat Page</div>
  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex gap-8 w-full md:max-w-2xl items-center'>
        <Label htmlFor='flowiseURL'>History search:</Label>
        <Input
          className='flex-1 bg-white h-8 border-[1px] disabled:bg-gray-100 disabled:text-gray-400 px-2'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
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
            <IconSpinner className='mr-2' />
            Searching for a match...
          </div>
        )}

        {foundWebsite ? (
          <div className='flex flex-col gap-2'>
            <Typography variant='h5' className='text-gray-600 capitalize'>
              {foundWebsite?.hostName}
            </Typography>
            <Typography variant='p' className='text-gray-600'>
              {foundWebsite?.summary}
            </Typography>
            <img
              width={500}
              alt={foundWebsite?.metaDescription}
              src={foundWebsite?.image}
            />
          </div>
        ) : null}

        {history.length ? (
          <ScrollArea className='flex-1 relative flex flex-col gap-2 max-h-[75vh] rounded-md border py-4 px-2'>
            <Typography variant='h5' className='mb-4 text-gray-700'>
              Last Visited
            </Typography>
            <div className='flex flex-col gap-2 mt-4 cursor-default'>
              {history.map((item, index) => (
                <div key={index} className='flex gap-2 items-center'>
                  <GlobeIcon />
                  {item.name}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : null}
      </div>
    </div>
  )
}
