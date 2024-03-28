import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

import '@blocknote/core/fonts/inter.css'
import '@blocknote/react/style.css'
import {
  Block,
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from '@blocknote/core'

import {
  BlockColorsItem,
  BlockNoteView,
  DragHandleMenu,
  DragHandleMenuItem,
  BlockTypeSelect,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  SuggestionMenuItem,
  getFormattingToolbarItems,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'

import { Separator } from '@/components/ui/separator'
import { DEFAULT_EDITOR_OPTIONS } from './utils'
import { MentionSchema, getMentionMenuItems } from './mention'

export default function EditorWrapper() {
  const { theme } = useTheme()

  const schema = BlockNoteSchema.create({
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      mention: MentionSchema,
    },
  })

  const editor = useCreateBlockNote({
    ...DEFAULT_EDITOR_OPTIONS,
    schema,
  })

  // Stores the selected blocks as an array of Block objects.
  const [blocks, setBlocks] = useState<Block[]>([])

  const addContent = (content: string) => {
    // const block = editor.getBlock(blockIdentifier);
    // editor.insertBlocks(
    // blocksToInsert: PartialBlock[],
    // referenceBlock: BlockIdentifier,
    // placement: "before" | "after" | "nested" = "before"
    // );
    // Usage
    // editor.insertBlocks([{type: "paragraph", text: "Hello World"}], referenceBlock, placement)
  }

  const onAutocomplete = async () => {
    const linkUrl = editor.getSelectedLinkUrl()
    const text = editor.getSelectedText()
    const selection = editor.getSelection()

    const textCursorPosition = editor.getTextCursorPosition()
    // editor.setTextCursorPosition(targetBlock, placement);

    // Usage
    editor.insertInlineContent([
      'Hello ',
      { type: 'text', text: 'World', styles: { bold: true } },
    ])
  }
  const onSelectionChange = () => {
    const selection = editor.getSelection()
    const text = editor.getSelectedText()
    const textCursorPosition = editor.getTextCursorPosition()

    // Get the blocks in the current selection and store on the state. If
    // the selection is empty, store the block containing the text cursor
    // instead.
    if (selection !== undefined) {
      console.log(selection)
      setBlocks(selection.blocks as Block[])
    } else {
      setBlocks([editor.getTextCursorPosition().block as Block])
    }
  }

  const editorTheme = useMemo(() => {
    switch (theme) {
      case 'dark':
        return 'dark'
      case 'light':
        return 'light'
      default: // for system theme, we don't set anything
        return
    }
  }, [theme])

  return (
    <BlockNoteView
      editor={editor}
      theme={editorTheme}
      onSelectionChange={onSelectionChange}
      sideMenu={false}
    >
      <SideMenuController
        sideMenu={(props) => (
          <SideMenu
            {...props}
            dragHandleMenu={(props) => (
              <DragHandleMenu {...props}>
                <BlockColorsItem {...props}>Colors</BlockColorsItem>
                {/* Item which resets the hovered block's type. */}
                <DragHandleMenuItem
                  onClick={() => {
                    editor.updateBlock(props.block, { type: 'paragraph' })
                  }}
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
      <SuggestionMenuController
        triggerCharacter={'@'}
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(getMentionMenuItems(editor), query)
        }
      />
    </BlockNoteView>
  )
}
