'use client'
import { useEffect, useRef, useState, memo } from 'react'

import dynamic from 'next/dynamic'

import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/typography'

// This will crash if rendered server side and this solves it
const Editor = dynamic(() => import('./editor-wrapper'), { ssr: false })

export function NotesComponent() {
  const [editor, setEditor] = useState(null)

  return (
    <div id='notes' className='flex flex-col flex-1 h-screen overflow-hidden'>
      <div className='py-8 px-16'>
        <Typography variant='h1'>Notes</Typography>
      </div>
      <Separator />
      <div className='py-8 px-16 overflow-auto'>
        <Editor />
      </div>
    </div>
  )
}
