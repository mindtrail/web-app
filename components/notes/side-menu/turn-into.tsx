import { ReactNode, useCallback, useRef, useMemo, useState } from 'react'
import {
  checkDefaultBlockTypeInSchema,
  BlockSchema,
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  InlineContentSchema,
  StyleSchema,
} from '@blocknote/core'
import {
  useBlockNoteEditor,
  DragHandleMenuItem,
  DragHandleMenuProps,
  blockTypeSelectItems,
  useSelectedBlocks,
  BlockTypeSelectItem,
  useEditorContentOrSelectionChange,
} from '@blocknote/react'

import { Box, Menu } from '@mantine/core'
import { HiChevronRight } from 'react-icons/hi'

// import { useBlockNoteEditor } from 'useBlockNoteEditor";
// import { DragHandleMenuProps } from "../../DragHandleMenuProps";
// import { DragHandleMenuItem } from "../DragHandleMenuItem";

export const TurnIntoMenuItem = <
  BSchema extends BlockSchema = DefaultBlockSchema,
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema,
>(
  props: DragHandleMenuProps<BSchema, I, S> & {
    children: ReactNode
  },
) => {
  const editor = useBlockNoteEditor<BSchema, I, S>()

  const [opened, setOpened] = useState(false)
  const selectedBlocks = useSelectedBlocks()

  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | undefined>()

  const startMenuCloseTimer = useCallback(() => {
    if (menuCloseTimer.current) {
      clearTimeout(menuCloseTimer.current)
    }
    menuCloseTimer.current = setTimeout(() => {
      setOpened(false)
    }, 100)
  }, [])

  const stopMenuCloseTimer = useCallback(() => {
    if (menuCloseTimer.current) {
      clearTimeout(menuCloseTimer.current)
    }
    setOpened(true)
  }, [])

  const [block, setBlock] = useState(editor.getTextCursorPosition().block)

  const fullItems = useMemo(() => {
    const onClick = (item: BlockTypeSelectItem) => {
      editor.focus()

      for (const block of selectedBlocks) {
        editor.updateBlock(block, {
          type: item.type as any,
          props: item.props as any,
        })
      }
    }

    const filteredItems = blockTypeSelectItems.filter((item) =>
      checkDefaultBlockTypeInSchema(item.type as keyof DefaultBlockSchema, editor),
    )

    return filteredItems.map((item) => ({
      text: item.name,
      icon: item.icon,
      onClick: () => onClick(item),
      // @ts-ignore
      isSelected: item.isSelected(block),
    }))
  }, [block, editor, selectedBlocks])

  useEditorContentOrSelectionChange(() => {
    setBlock(editor.getTextCursorPosition().block)
  }, editor)

  console.log(selectedBlocks)

  return (
    <DragHandleMenuItem
      onMouseLeave={startMenuCloseTimer}
      onMouseOver={stopMenuCloseTimer}
    >
      <Menu withinPortal={false} opened={opened} position={'right'}>
        <Menu.Target>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>{props.children}</div>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <HiChevronRight size={15} />
            </Box>
          </div>
        </Menu.Target>
        <Menu.Dropdown
          onMouseLeave={startMenuCloseTimer}
          onMouseOver={stopMenuCloseTimer}
          style={{ marginLeft: '5px' }}
        >
          <div>1234</div>
          <div>4444</div>
        </Menu.Dropdown>
      </Menu>
    </DragHandleMenuItem>
  )
}
