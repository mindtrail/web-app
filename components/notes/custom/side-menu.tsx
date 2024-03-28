import { BlockNoteEditor } from '@blocknote/core'
import {
  BlockColorsItem,
  ColorStyleButton,
  DragHandleMenu,
  DragHandleMenuItem,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
} from '@blocknote/react'

import { TrashIcon, SymbolIcon } from '@radix-ui/react-icons'

import { ColorPaletteIcon } from '@/components/ui/icons/next-icons'
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
              <BlockColorsItem {...props}>
                <div className='flex gap-1'>
                  <ColorPaletteIcon className='w-4 h-4' />
                  Colors
                </div>
              </BlockColorsItem>
              {/* Item which resets the hovered block's type. */}
              <DragHandleMenuItem
                onClick={() => {
                  editor.updateBlock(props.block, { type: 'paragraph' })
                }}
              >
                <div className='flex gap-1'>
                  <SymbolIcon className='w-4 h-4' />
                  Turn into
                </div>
              </DragHandleMenuItem>
              {/* <BlockTypeSelect>Change Type</BlockTypeSelect> */}
              <Separator className='my-2' />
              <RemoveBlockItem {...props}>
                <div className='flex gap-1'>
                  <TrashIcon className='w-4 h-4' />
                  Delete
                </div>
              </RemoveBlockItem>
            </DragHandleMenu>
          )}
        />
      )}
    />
  )
}
