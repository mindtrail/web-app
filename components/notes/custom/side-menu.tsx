import { BlockNoteEditor } from '@blocknote/core'
import {
  BlockColorsItem,
  DragHandleMenu,
  DragHandleMenuItem,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
} from '@blocknote/react'

import { Separator } from '@/components/ui/separator'

interface CustomSideMenuProps {
  editor: BlockNoteEditor<any, any, any>
}
export function CustomSideMenu({ editor }: CustomSideMenuProps) {
  return (
    <SideMenuController
      sideMenu={(props) => (
        <SideMenu
          {...props}
          dragHandleMenu={(props) => (
            <DragHandleMenu {...props} data-theming-mindtrail-demo='true'>
              <BlockColorsItem {...props}>Colors</BlockColorsItem>
              {/* Item which resets the hovered block's type. */}
              <DragHandleMenuItem
                onClick={() => {
                  editor.updateBlock(props.block, { type: 'paragraph' })
                }}
                className='width-64'
              >
                Change Type
              </DragHandleMenuItem>
              {/* <BlockTypeSelect>Change Type</BlockTypeSelect> */}
              <Separator />
              <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
            </DragHandleMenu>
          )}
        />
      )}
    />
  )
}
