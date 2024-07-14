import { useCallback } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { EditorBubbleItem, useEditor } from 'novel'

import { Button } from '@/components/ui/button'

import { PopoverSelector } from '../popover-selector'
import { HIGHLIGHT_COLORS, TEXT_COLORS } from './constants'

export const ColorSelector = () => {
  let { editor } = useEditor()

  const ColorSelectorTrigger = useCallback(() => {
    if (!editor) return

    const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
      editor?.isActive('highlight', { color }),
    )

    const activeColorItem = TEXT_COLORS.find(({ color }) =>
      editor?.isActive('textStyle', { color }),
    )

    return (
      <Button size='sm' className='gap-2 rounded-none' variant='ghost'>
        <span
          className='rounded-sm px-1'
          style={{
            color: activeColorItem?.color,
            backgroundColor: activeHighlightItem?.color,
          }}
        >
          A
        </span>
        <ChevronDown className='h-4 w-4' />
      </Button>
    )
  }, [editor])

  const ColorSelectorContent = useCallback(
    () => (
      <>
        <div className='flex flex-col'>
          <div className='my-1 px-2 text-sm font-semibold text-muted-foreground'>
            Color
          </div>
          {TEXT_COLORS.map(({ name, color }, index) => (
            <EditorBubbleItem
              key={index}
              onSelect={() => {
                editor?.commands.unsetColor()
                name !== 'Default' &&
                  editor
                    ?.chain()
                    .focus()
                    .setColor(color || '')
                    .run()
              }}
              className='flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent'
            >
              <div className='flex items-center gap-2'>
                <div
                  className='rounded-sm border px-2 py-px font-medium'
                  style={{ color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
            </EditorBubbleItem>
          ))}
        </div>
        <div>
          <div className='my-1 px-2 text-sm font-semibold text-muted-foreground'>
            Background
          </div>
          {HIGHLIGHT_COLORS.map(({ name, color }, index) => (
            <EditorBubbleItem
              key={index}
              onSelect={() => {
                editor?.commands.unsetHighlight()
                name !== 'Default' && editor?.commands.setHighlight({ color })
              }}
              className='flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent'
            >
              <div className='flex items-center gap-2'>
                <div
                  className='rounded-sm border px-2 py-px font-medium'
                  style={{ backgroundColor: color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
              {editor?.isActive('highlight', { color }) && <Check className='h-4 w-4' />}
            </EditorBubbleItem>
          ))}
        </div>
      </>
    ),
    [editor],
  )

  return (
    <PopoverSelector
      renderTrigger={ColorSelectorTrigger}
      renderContent={ColorSelectorContent}
      contentProps={{
        className:
          'my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl ',
      }}
    />
  )
}
