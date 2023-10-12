'use client'
import { useState, MouseEvent, KeyboardEvent } from 'react'
import { DataSrc } from '@prisma/client'
import { GlobeIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconSpinner } from '@/components/ui/icons'
import Typography from '@/components/typography'
import { ScrollArea } from '@/components/ui/scroll-area'
import * as cheerio from 'cheerio'

type HistoryLookupProps = {
  userId: string
  historyItems: DataSrc[]
}

async function getOGData(url: string) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const $ = cheerio.load(html)

      const title = $.html('title')
      const description = $.html('meta[name="description"]')
      const image = $.html('meta[property="og:image"]')

      return {
        title,
        description,
        image,
      }
    })
    .catch((error) => console.error(error))
}

export function HistoryLookup({ userId, historyItems }: HistoryLookupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [processing, setProcessing] = useState(false)
  const [foundWebsites, setFoundWebsites] = useState([])
  const [history, setHistory] = useState(historyItems)

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(event)
    }
  }

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
      setFoundWebsites(websites)
    } catch (e) {
      console.log('error', e)
      setProcessing(false)
    }
  }

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

        {foundWebsites.length ? (
          <>
            <Typography variant='h5' className='text-gray-700'>
              Search results
            </Typography>
            <iframe className='w-full flex-1' src={foundWebsites[0]} />
          </>
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
