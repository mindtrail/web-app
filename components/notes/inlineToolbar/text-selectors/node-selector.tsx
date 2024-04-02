import { useCallback } from 'react'
import { EditorBubbleItem, useEditor } from 'novel'
import { Check, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { PopoverSelector } from '../popover-selector'
import { NODE_TYPES } from './constants'

export const NodeSelector = () => {
  const { editor } = useEditor()

  const activeItem =
    NODE_TYPES.filter((item) => editor && item.isActive(editor))?.pop()?.name ??
    'Multiple'

  const NodeSelectorTrigger = useCallback(
    () => (
      <Button size='sm' variant='ghost' className='gap-2'>
        <span className='whitespace-nowrap text-sm'>{activeItem}</span>
        <ChevronDown className='h-4 w-4' />
      </Button>
    ),
    [activeItem],
  )

  const NodeSelectorContent = useCallback(
    (closeModal: () => void) =>
      NODE_TYPES.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor)
            closeModal()
          }}
          className='flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent'
        >
          <div className='flex items-center space-x-2'>
            <div className='rounded-sm border p-1'>
              <item.icon className='h-3 w-3' />
            </div>
            <span>{item.name}</span>
          </div>
          {activeItem === item.name && <Check className='h-4 w-4' />}
        </EditorBubbleItem>
      )),
    [activeItem],
  )

  if (!editor) return null

  return (
    <PopoverSelector
      renderTrigger={NodeSelectorTrigger}
      renderContent={NodeSelectorContent}
      contentProps={{ className: 'w-48 p-1' }}
    />
  )
}
