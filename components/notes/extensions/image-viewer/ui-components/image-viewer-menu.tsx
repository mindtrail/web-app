import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { useCallback, useRef } from 'react'
import { Instance, sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'

import { Toolbar } from '@/components/ui/Toolbar'
import { Icon } from '@/components/ui/Icon'
import { ImageBlockWidth } from './image-viewer-width'
import { MenuProps } from '@/components/menus/types'
import { getRenderContainer } from '@/lib/utils'

export const ImageBlockMenu = ({ editor, appendTo }: MenuProps): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null)
  const tippyInstance = useRef<Instance | null>(null)

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, 'node-imageViewer')
    const rect =
      renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)

    return rect
  }, [editor])

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('imageViewer')

    return isActive
  }, [editor])

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageViewerAlign('left')
      .run()
  }, [editor])

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageViewerAlign('center')
      .run()
  }, [editor])

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
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
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageViewerMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance
        },
        appendTo: () => {
          return appendTo?.current
        },
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      <Toolbar.Wrapper shouldShowContent={shouldShow()} ref={menuRef}>
        <Toolbar.Button
          tooltip='Align image left'
          active={editor.isActive('imageViewer', { align: 'left' })}
          onClick={onAlignImageLeft}
        >
          <Icon name='AlignHorizontalDistributeStart' />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip='Align image center'
          active={editor.isActive('imageViewer', { align: 'center' })}
          onClick={onAlignImageCenter}
        >
          <Icon name='AlignHorizontalDistributeCenter' />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip='Align image right'
          active={editor.isActive('imageViewer', { align: 'right' })}
          onClick={onAlignImageRight}
        >
          <Icon name='AlignHorizontalDistributeEnd' />
        </Toolbar.Button>
        <Toolbar.Divider />
        <ImageBlockWidth
          onChange={onWidthChange}
          value={parseInt(editor.getAttributes('imageViewer').width)}
        />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  )
}

export default ImageBlockMenu
