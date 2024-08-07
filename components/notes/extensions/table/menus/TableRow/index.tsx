import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { useCallback } from 'react'
import { EditorBubble, useEditor } from 'novel'

import * as PopoverMenu from '@/components/ui/tiptap/PopoverMenu'
import { Toolbar } from '@/components/ui/tiptap/Toolbar'
import { isRowGripSelected } from './utils'
import { Icon } from '@/components/ui/tiptap/Icon'

export const TableRowMenu = React.memo(({ appendTo }: MenuProps): JSX.Element => {
  const { editor } = useEditor()
  if (!editor) return null

  const shouldShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state || !from) {
        return false
      }

      return isRowGripSelected({ editor, view, state, from })
    },
    [editor],
  )

  const onAddRowBefore = useCallback(() => {
    editor.chain().focus().addRowBefore().run()
  }, [editor])

  const onAddRowAfter = useCallback(() => {
    editor.chain().focus().addRowAfter().run()
  }, [editor])

  const onDeleteRow = useCallback(() => {
    editor.chain().focus().deleteRow().run()
  }, [editor])

  return (
    <EditorBubble
      shouldShow={shouldShow}
      pluginKey='tableRowMenu'
      updateDelay={0}
      tippyOptions={{
        appendTo: () => {
          return appendTo?.current
        },
        placement: 'left',
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
      }}
    >
      <Toolbar.Wrapper isVertical>
        <PopoverMenu.Item
          iconComponent={<Icon name='ArrowUpToLine' />}
          close={false}
          label='Add row before'
          onClick={onAddRowBefore}
        />
        <PopoverMenu.Item
          iconComponent={<Icon name='ArrowDownToLine' />}
          close={false}
          label='Add row after'
          onClick={onAddRowAfter}
        />
        <PopoverMenu.Item
          icon='Trash'
          close={false}
          label='Delete row'
          onClick={onDeleteRow}
        />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  )
})

TableRowMenu.displayName = 'TableRowMenu'

export default TableRowMenu
