'use client'
import { useState, MouseEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconSpinner } from '@/components/ui/icons'

type HistoryLookupProps = {
  userId: string
}

export function HistoryLookup({ userId }: HistoryLookupProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleSearch = async (event: MouseEvent) => {
    event.preventDefault()
    console.log('searching for', searchQuery)
    setProcessing(true)
    try {
      await fetch('/api/history', {
        method: 'POST',
        body: JSON.stringify({ userId, searchQuery }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setProcessing(false)
    } catch (e) {
      console.log('error', e)
      setProcessing(false)
    }
  }

  // return <div>Chat Page</div>
  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'></div>
      <div className='flex gap-8 w-full md:max-w-2xl items-center'>
        <Label htmlFor='flowiseURL'>History search:</Label>
        <Input
          className='flex-1 bg-white h-8 border-[1px] disabled:bg-gray-100 disabled:text-gray-400 px-2'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value?.trim())}
          placeholder='A website about travel'
        />
        <Button onClick={handleSearch} disabled={!searchQuery}>
          {processing && <IconSpinner className='mr-2' />}
          Search
        </Button>
      </div>
    </div>
  )
}
