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
} from '@blocknote/react'

import { Separator } from '@/components/ui/separator'
import { EDITOR_OPTIONS } from './utils'
import { Mention } from './mention'

export default function EditorWrapper() {
  // Our schema with inline content specs, which contain the configs and
  // implementations for inline content  that we want our editor to use.
  const schema = BlockNoteSchema.create({
    inlineContentSpecs: {
      // Adds all default inline content.
      ...defaultInlineContentSpecs,
      // Adds the mention tag.
      mention: Mention,
    },
  })

  // Function which gets all users for the mentions menu.
  const getMentionMenuItems = (
    editor: typeof schema.BlockNoteEditor,
  ): DefaultReactSuggestionItem[] => {
    const users = ['Steve', 'Bob', 'Joe', 'Mike']

    return users.map((user) => ({
      title: user,
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: 'mention',
            props: { user },
          },
          ' ', // add a space after the mention
        ])
      },
    }))
  }

  const editor = useCreateBlockNote({
    ...EDITOR_OPTIONS,
    schema,
    placeholders: {
      default: "Write something, or press 'space' for AI, '/' for commands",
      heading: 'Heading',
      bulletListItem: 'List',
      numberedListItem: 'List',
    },
  })
  const { theme } = useTheme()

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
