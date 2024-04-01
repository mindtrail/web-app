'use client'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/typography'
import Editor from './editor-wrapper'

export default function NotesComponent() {
  return (
    <div id='notes' className='flex flex-col flex-1 h-screen overflow-hidden'>
      <div className='py-12 px-16'>
        <Typography variant='h1'>Notes</Typography>
      </div>
      <Separator />
      <div className='py-12 px-16 overflow-auto'>
        <Editor />
      </div>
    </div>
  )
}
