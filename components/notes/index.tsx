'use client'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/typography'
import Editor from './editor-wrapper'

export function NotesComponent() {
  return (
    <div id='notes' className='flex flex-col flex-1 h-screen overflow-hidden'>
      <div className='py-8 px-16'>
        <Typography variant='h2'>Scrib - No code Notebook</Typography>
        {/* <Typography
          variant='small'
          className='rounded-md px-1.5 py-0.5 bg-violet-50 text-violet-800'
        >

          No code - Notebook
        </Typography> */}
      </div>
      <Separator />
      <div className='px-4 py-4 sm:px-8 md:py-8 md:px-16 overflow-auto'>
        <Editor />
      </div>
    </div>
  )
}
