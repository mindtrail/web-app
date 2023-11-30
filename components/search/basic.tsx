'use client'

import { useState, MouseEvent, KeyboardEvent, useEffect } from 'react'
import { Document } from 'langchain/document'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type WebsiteSearchResult = Document['metadata'] | null

type SearchProps = {
  userId: string
}

export const SearchBasic = ({ userId }: SearchProps) => {
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

  return (
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
  )
}
