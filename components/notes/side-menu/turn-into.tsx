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
  blockTypeSelectItems,
  useSelectedBlocks,
  useBlockNoteEditor,
  useEditorContentOrSelectionChange,
  DragHandleMenuItem,
  DragHandleMenuProps,
  BlockTypeSelectItem,
} from '@blocknote/react'
import { TiTick } from 'react-icons/ti'

import { Box, Menu } from '@mantine/core'
import { HiChevronRight } from 'react-icons/hi'

// import { useBlockNoteEditor } from 'useBlockNoteEditor";
// import { DragHandleMenuProps } from "../../DragHandleMenuProps";
// import { DragHandleMenuItem } from "../DragHandleMenuItem";

interface TurnIntoMenuItemProps extends DragHandleMenuProps {
  children: ReactNode
}

export const TurnIntoMenuItem = <
  BSchema extends BlockSchema = DefaultBlockSchema,
  I extends InlineContentSchema = DefaultInlineContentSchema,
  S extends StyleSchema = DefaultStyleSchema,
>(
  props: TurnIntoMenuItemProps,
) => {
  const { children, block } = props

  const editor = useBlockNoteEditor<BSchema, I, S>()
  const selectedBlocks = useSelectedBlocks()
  const [opened, setOpened] = useState(false)

  const selectionContainsImgOrTablse =
    block.type === 'image' ||
    block.type === 'table' ||
    selectedBlocks.find((block) => block.type === 'image' || block.type === 'table')

  // This part is copied from a similar Blocknote component
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

  const fullItems = useMemo(() => {
    const onClick = (item: BlockTypeSelectItem) => {
      editor.focus()
      console.log(22222, item)

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
      isSelected:
        item.type === block.type &&
        item?.props?.level && // @ts-ignore
        item?.props?.level === block?.props?.level,
    }))
  }, [block, editor, selectedBlocks])

  // We don't show this menu item if the selection contains an image or table.
  if (selectionContainsImgOrTablse) {
    return null
  }

  return (
    <DragHandleMenuItem
      onMouseLeave={startMenuCloseTimer}
      onMouseOver={stopMenuCloseTimer}
    >
      <Menu withinPortal={false} opened={opened} position={'right'}>
        <Menu.Target>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>{children}</div>
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
          <>
            <Menu.Label>Turn Items into:</Menu.Label>
            {fullItems?.map(({ text, icon: Icon, onClick, isSelected }) => (
              <Menu.Item
                onClick={onClick}
                component={'div'}
                data-test={'turn-into-' + text}
                leftSection={<Icon />}
                rightSection={
                  isSelected ? (
                    <TiTick size={20} className={'bn-tick-icon'} />
                  ) : (
                    // Ensures space for tick even if item isn't currently selected.
                    <div className={'bn-tick-space'} />
                  )
                }
                key={'turn-into-' + text}
              >
                {text}
              </Menu.Item>
            ))}
          </>
        </Menu.Dropdown>
      </Menu>
    </DragHandleMenuItem>
  )
}
