import { ReactNode, useCallback, useRef, useState } from 'react'
import {
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

  console.log(1111, props.block.type)

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
