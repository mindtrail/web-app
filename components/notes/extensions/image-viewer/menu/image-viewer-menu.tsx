import React, { useCallback } from 'react'
import { EditorBubble, useEditor } from 'novel'
import {
  AlignHorizontalJustifyStartIcon,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ImageViewerWidth } from './width-slider'

export const ImageViewerMenu = () => {
  const { editor } = useEditor()
  if (!editor) return null

  const shouldShow = useCallback(() => editor.isActive('imageViewer'), [editor])

  const onAlignImageLeft = useCallback(() => {
    editor.chain().setImageViewerAlign('left').run()
  }, [editor])

  const onAlignImageCenter = useCallback(() => {
    editor.chain().setImageViewerAlign('center').run()
  }, [editor])

  const onAlignImageRight = useCallback(() => {
    editor.chain().setImageViewerAlign('right').run()
  }, [editor])

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageViewerWidth(value)
        .run()
    },
    [editor],
  )
  const imageAttrs = editor.getAttributes('imageViewer')

  return (
    <EditorBubble
      shouldShow={shouldShow}
      pluginKey='imageViewerMenu'
      className='flex w-fit items-center overflow-hidden rounded-md border border-muted bg-background shadow-xl px-2 py-1 gap-2'
    >
      <div className='flex'>
        <Button
          onClick={onAlignImageLeft}
          variant='ghost'
          size='icon'
          className={`${imageAttrs?.align === 'left' ? 'bg-muted' : ''}`}
        >
          <AlignHorizontalJustifyStartIcon className='h-4 w-4' />
        </Button>
        <Button
          onClick={onAlignImageCenter}
          variant='ghost'
          size='icon'
          className={`${imageAttrs?.align === 'center' ? 'bg-muted' : ''}`}
        >
          <AlignHorizontalJustifyCenterIcon className='h-4 w-4' />
        </Button>
        <Button
          onClick={onAlignImageRight}
          variant='ghost'
          size='icon'
          className={`${imageAttrs?.align === 'right' ? 'bg-muted' : ''}`}
        >
          <AlignHorizontalJustifyEndIcon className='h-4 w-4' />
        </Button>
      </div>

      <ImageViewerWidth
        onChange={onWidthChange}
        value={parseInt(imageAttrs?.width || 0)}
      />
    </EditorBubble>
  )
}

export default ImageViewerMenu
