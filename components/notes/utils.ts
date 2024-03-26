import { BlockNoteEditorOptions, PartialBlock } from '@blocknote/core' // @ts-ignore
import AIText from './ai-autocomplete'
// import AIText from '@alkhipce/editorjs-aitext'

const mockData: PartialBlock[] = [
  {
    type: 'paragraph',
    content: 'Welcome to this demo!',
  },
  {
    type: 'paragraph',
    content: '<- Click the Drag Handle to see the new item',
  },
  {
    type: 'bulletListItem',
    content: "Try resetting this block's type using the new Drag Handle Menu item",
  },
  {
    type: 'paragraph',
  },
]

const PLACEHOLDER_MSG = "Write, press 'space' for AI or '/' for more"
const editorOptions: BlockNoteEditorOptions = {
  
}
