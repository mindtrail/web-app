import React, { useCallback, useRef, useState } from 'react'
import { Instance } from 'tippy.js'
import { EditorBubble, useEditor } from 'novel'
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ImageViewerWidth } from './width'

export const ImageViewerMenu = () => {
  const { editor } = useEditor()
  const tippyInstance = useRef<Instance | null>(null)

  if (!editor) return null

  const shouldShow = useCallback(() => {
    console.log(1111, editor.isActive('imageViewer'), editor)
    return editor.isActive('imageViewer')
  }, [editor])

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      // .focus(undefined, { scrollIntoView: false })
      .setImageViewerAlign('left')
      .run()
  }, [editor])

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      // .focus(undefined, { scrollIntoView: false })
      .setImageViewerAlign('center')
      .run()
  }, [editor])

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      // .focus(undefined, { scrollIntoView: false })
      .setImageViewerAlign('right')
      .run()
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

  return (
    <EditorBubble
      shouldShow={shouldShow}
      tippyOptions={{
        offset: [0, 8],
        placement: 'top',
        onHidden: () => {
          editor.chain().unsetHighlight().run()
        },
        onCreate: (instance: Instance) => {
          console.log(222, instance)
          // tippyInstance.current = instance
        },
      }}
      className='flex w-fit items-center overflow-hidden rounded-md border border-muted bg-background shadow-xl'
    >
      <Button
        onClick={onAlignImageLeft}
        variant='ghost'
        className={`rounded-none ${editor.isActive('imageViewer', { align: 'left' }) ? 'bg-muted' : ''}`}
      >
        <AlignLeftIcon className='h-4 w-4' />
      </Button>
      <Separator orientation='vertical' className='h-4' />
      <Button
        onClick={onAlignImageCenter}
        variant='ghost'
        className={`rounded-none ${editor.isActive('imageViewer', { align: 'center' }) ? 'bg-muted' : ''}`}
      >
        <AlignCenterIcon className='h-4 w-4' />
      </Button>
      <Separator orientation='vertical' className='h-4' />
      <Button
        onClick={onAlignImageRight}
        variant='ghost'
        className={`rounded-none ${editor.isActive('imageViewer', { align: 'right' }) ? 'bg-muted' : ''}`}
      >
        <AlignRightIcon className='h-4 w-4' />
      </Button>

      <Separator orientation='vertical' className='h-4' />
      <ImageViewerWidth
        onChange={onWidthChange}
        value={parseInt(editor.getAttributes('imageViewer').width || 0)}
      />
    </EditorBubble>
  )
}

export default ImageViewerMenu
