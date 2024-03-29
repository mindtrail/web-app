import { useMemo, useState, useEffect, useCallback } from 'react'
import { BlockNoteEditor } from '@blocknote/core'
import {
  useSelectedBlocks,
  AddBlockButton,
  BlockColorsItem,
  DragHandleButton,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
  useEditorSelectionChange,
} from '@blocknote/react'

import { TrashIcon, SymbolIcon } from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'

import { TurnIntoMenuItem } from './turn-into'
import { ColorIcon } from './color-icon'

interface CustomSideMenuProps {
  editor: BlockNoteEditor<any, any, any>
}

function useUIPluginState<State>(
  onUpdate: (callback: (state: State) => void) => void,
): State | undefined {
  const [state, setState] = useState<State>()

  useEffect(() => {
    return onUpdate((state) => {
      setState({ ...state })
    })
  }, [onUpdate])

  return state
}
export function CustomSideMenu({ editor }: CustomSideMenuProps) {
  const state = useUIPluginState(editor.sideMenu.onUpdate.bind(editor.sideMenu))
  const targetBlock = state?.block

  const selectedBlocks = useSelectedBlocks()

  const updateSelectedBlocks = useCallback(
    (block: any) => {
      console.log(block)
      if (!targetBlock) {
        return
      }

      // If the targetBlock is not among the selected blocks, only highlight it,
      // and change the selection to it
      console.log(selectedBlocks, targetBlock)

      if (!selectedBlocks.find((block) => block.id === targetBlock.id)) {
        // selector for the id and a specific classname
        return
      }

      // console.log(editor.getSelection())
      // editor.focus()
      console.log(state)
    },
    [editor, targetBlock, state],
  )

  if (!targetBlock) {
    return null
  }

  return (
    <SideMenuController
      sideMenu={(props) => (
        <SideMenu {...props}>
          <AddBlockButton addBlock={props.addBlock} />

          <div onClick={() => updateSelectedBlocks(props)}>
            <DragHandleButton
              {...props}
              dragHandleMenu={(props) => (
                <DragHandleMenu {...props}>
                  <div className='flex flex-col'></div>
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

                  <TurnIntoMenuItem {...props}>
                    <div className='flex gap-1'>
                      <SymbolIcon className='w-4 h-4' />
                      Turn into
                    </div>
                  </TurnIntoMenuItem>

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
          </div>
        </SideMenu>
      )}
    />
  )
}
