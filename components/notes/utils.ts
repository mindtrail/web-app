import { PartialBlock } from '@blocknote/core' // @ts-ignore
import AIText from './ai-autocomplete'
// import AIText from '@alkhipce/editorjs-aitext'

const initialContent: PartialBlock[] = [
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
export const EDITOR_OPTIONS = {
  initialContent,
  uploadFile: async (file: File): Promise<string> => {
    console.log('file', file)
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = {
          success: true,
          file: {
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
          },
        }

        resolve(res)
      }, 1000)

      console.log(result)
    })

    return 'true'
  },
}
