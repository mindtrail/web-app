'use client'

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

import Tags from '@yaireo/tagify/dist/react.tagify'
import '@yaireo/tagify/dist/tagify.css' // Tagify CSS

export const SearchBar = () => {
  return (
    <div className='flex w-full items-center justify-between'>
      <Tags className='flex-1' autoFocus={true} placeholder='Search' />
      helo 1
    </div>
  )
}
