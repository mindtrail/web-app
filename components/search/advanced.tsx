'use client'

import Tags from '@yaireo/tagify/dist/react.tagify'
import '@yaireo/tagify/dist/tagify.css' // Tagify CSS

import { FilterIcon } from '@/components/ui/icons/custom'
import { Button } from '@/components/ui/button'

export const SearchAdvanced = () => {
  return (
    <div className='flex w-full items-center justify-between'>
      <Tags className='rounded' autoFocus={true} placeholder='Search' />
      <div>
        <Button size='sm' variant='ghost'>
          <FilterIcon className='h-6 w-6' />
        </Button>
      </div>
    </div>
  )
}
