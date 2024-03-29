import { useMemo } from 'react'
import { BlockNoteEditor } from '@blocknote/core'
import {
  BlockColorsItem,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
  useSelectedBlocks,
} from '@blocknote/react'

import { TrashIcon, SymbolIcon } from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'

import { TurnIntoMenuItem } from './turn-into'
import { ColorIcon } from './color-icon'

interface CustomSideMenuProps {
  editor: BlockNoteEditor<any, any, any>
}
export function CustomSideMenu({ editor }: CustomSideMenuProps) {
  const selectedBlocks = useSelectedBlocks()
  console.log(selectedBlocks)

  const selectionContainsImgOrTablse = useMemo(
    () =>
      selectedBlocks.find((block) => block.type === 'image' || block.type === 'table'),
    [selectedBlocks],
  )

  console.log(selectionContainsImgOrTablse)

  return (
    <SideMenuController
      sideMenu={(props) => (
        <SideMenu
          {...props}
          dragHandleMenu={(props) => (
            <DragHandleMenu {...props} data-theming-mindtrail-demo='true'>
              <BlockColorsItem {...props}>
                <div className='flex gap-1 '>
                  <ColorIcon
                    textColor={'currentTextColor'}
                    backgroundColor={'currentBackgroundColor'}
                    size={20}
                  />
                  Colors
                </div>
              </BlockColorsItem>

              {!selectionContainsImgOrTablse && (
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
