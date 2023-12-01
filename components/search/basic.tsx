'use client'
import { useState, MouseEvent, KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SearchProps = {
  handleSearch: (searchQuery: string) => void
}

export const SearchBasic = ({ handleSearch }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  const onSearchClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    handleSearch(searchQuery)
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
      <Button onClick={onSearchClick} disabled={!searchQuery}>
        Search
      </Button>
    </div>
  )
}
