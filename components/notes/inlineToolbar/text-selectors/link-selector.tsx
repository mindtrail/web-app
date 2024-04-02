import { useEffect, useRef, useCallback, useState } from 'react'
import { useEditor } from 'novel'
import { Check, Trash } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { PopoverSelector } from '../popover-selector'

export const LinkSelector = () => {
  const { editor } = useEditor()
  const [url, setUrl] = useState('')

  const LinkSelectorTrigger = useCallback(
    () => (
      <Button size='sm' variant='ghost' className='gap-2 rounded-none border-none'>
        <p className='text-base'>↗</p>
        <p
          className={cn('underline decoration-stone-400 underline-offset-4', {
            'text-blue-500': editor?.isActive('link'),
          })}
        >
          Link
        </p>
      </Button>
    ),
    [editor],
  )

  const LinkSelectorContent = useCallback(
    (closeModal: () => void) => {
      const handleUrlChange = (e: any) => {
        setUrl(e.target.value)
      }

      const handleSubmit = (e: any) => {
        e.preventDefault()
        if (!isValidUrl(url)) {
          alert('Please enter a valid URL')
          return
        }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        closeModal()
      }

      return (
        <form onSubmit={handleSubmit} className='flex p-1 gap-1 items-center'>
          <Input
            autoFocus
            placeholder='Paste or type a link...'
            value={url}
            onChange={handleUrlChange}
            className='border-none text-sm shadow-none'
          />
          {editor?.getAttributes('link').href ? (
            <Button
              size='icon'
              variant='outline'
              type='button'
              className='flex h-8 items-center rounded-sm text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800'
              onClick={() => {
                editor?.chain().focus().unsetLink().run()
                closeModal()
              }}
            >
              <Trash className='h-4 w-4' />
            </Button>
          ) : (
            <Button size='icon' className='h-8'>
              <Check className='h-4 w-4' />
            </Button>
          )}
        </form>
      )
    },
    [url, editor],
  )

  if (!editor) return null

  return (
    <PopoverSelector
      renderTrigger={LinkSelectorTrigger}
      renderContent={LinkSelectorContent}
      contentProps={{ className: 'w-60 p-0' }}
    />
  )
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}
export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString()
    }
  } catch (e) {
    return null
  }
}
