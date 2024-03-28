import {
  defaultInlineContentSpecs,
  filterSuggestionItems,
  BlockNoteEditor,
} from '@blocknote/core'
import { SuggestionMenuController } from '@blocknote/react'

import { MentionSchema, getMentionMenuItems } from './mention'
import { HashTagSchema, getHashtagsMenuItems } from './hashtag'

interface SuggestionMenuProps {
  editor: BlockNoteEditor<any, any, any>
}

export const customSuggestionSchema = {
  ...defaultInlineContentSpecs,
  mention: MentionSchema,
  hashtag: HashTagSchema,
}
export function CustomSuggestionMenus({ editor }: SuggestionMenuProps) {
  return (
    <>
      <SuggestionMenuController
        triggerCharacter={'@'}
        getItems={async (query) =>
          // Getsforma the mentions menu items
          filterSuggestionItems(getMentionMenuItems(editor), query)
        }
      />
      <SuggestionMenuController
        triggerCharacter={'#'}
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(getHashtagsMenuItems(editor), query)
        }
      />
    </>
  )
}
