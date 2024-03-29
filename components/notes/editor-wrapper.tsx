import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

import { Block, BlockNoteSchema, defaultInlineContentSpecs } from '@blocknote/core'
import { BlockNoteView, useCreateBlockNote } from '@blocknote/react'

import { DEFAULT_EDITOR_OPTIONS } from './utils'

import { CustomSuggestionMenus, customSuggestionSchema } from './inline-suggestion-menu'
import { CustomSideMenu } from './side-menu'

import '@blocknote/core/fonts/inter.css'
import '@blocknote/react/style.css'

export default function EditorWrapper() {
  const { theme } = useTheme()

  const schema = BlockNoteSchema.create({
    inlineContentSpecs: customSuggestionSchema,
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
      // console.log(selection)
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
      <CustomSideMenu editor={editor} />
      <CustomSuggestionMenus editor={editor} />
    </BlockNoteView>
  )
}
