import { EditorBubbleItem, useEditor } from 'novel'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { getTextFormattingOpts } from './constants'

export const TextFormatSelector = () => {
  const { editor } = useEditor()
  if (!editor) return null

  const formattingOpts = getTextFormattingOpts()

  return (
    <div className='flex'>
      {formattingOpts.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor)
          }}
        >
          <Button size='sm' className='rounded-none' variant='ghost'>
            <item.icon
              className={cn('h-4 w-4', {
                'text-blue-500': item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  )
}
