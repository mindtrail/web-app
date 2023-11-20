'use client'

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

import Tags from '@yaireo/tagify/dist/react.tagify'
import '@yaireo/tagify/dist/tagify.css' // Tagify CSS

import { Share2Icon, CaretSortIcon } from '@radix-ui/react-icons'
import { FilterIcon } from '@/components/ui/icons/custom'
import { Button } from '@/components/ui/button'

export const SearchBar = () => {
  return (
    <div className='flex w-full items-center justify-between'>
      <Tags className='flex-1' autoFocus={true} placeholder='Search' />
      <div>
        <Button size='sm' variant='ghost'>
          <FilterIcon className='h-6 w-6' />
        </Button>
        <Button size='sm' variant='ghost'>
          <Share2Icon className='h-6 w-6' />
        </Button>
        <Button size='sm' variant='ghost'>
          <CaretSortIcon className='h-6 w-6' />
        </Button>
      </div>
    </div>
  )
}
