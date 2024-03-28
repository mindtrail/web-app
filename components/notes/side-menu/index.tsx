import { BlockNoteEditor } from '@blocknote/core'
import {
  BlockColorsItem,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
  DragHandleMenuItem,
} from '@blocknote/react'

import { TrashIcon, SymbolIcon } from '@radix-ui/react-icons'

import { ColorPaletteIcon } from '@/components/ui/icons/next-icons'
import { Separator } from '@/components/ui/separator'

import { TurnIntoMenuItem } from './turn-into'

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
                <div className='flex gap-1 '>
                  <ColorPaletteIcon className='w-4 h-4' />
                  Colors
                </div>
              </BlockColorsItem>

              {props.block.type !== 'image' && (
                <TurnIntoMenuItem {...props}>
                  <div className='flex gap-1'>
                    <SymbolIcon className='w-4 h-4' />
                    Turn into
                  </div>
                </TurnIntoMenuItem>
              )}

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
