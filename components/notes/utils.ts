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
  },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Blocks:',
        styles: { bold: true },
      },
    ],
  },
  {
    type: 'paragraph',
    content: 'Paragraph',
  },
  {
    type: 'heading',
    content: 'Heading',
  },
  {
    type: 'bulletListItem',
    content: 'Bullet List Item',
  },
  {
    type: 'numberedListItem',
    content: 'Numbered List Item',
  },
  {
    type: 'image',
  },
  {
    type: 'table',
    content: {
      type: 'tableContent',
      rows: [
        {
          cells: ['Table Cell', 'Table Cell', 'Table Cell'],
        },
        {
          cells: ['Table Cell', 'Table Cell', 'Table Cell'],
        },
        {
          cells: ['Table Cell', 'Table Cell', 'Table Cell'],
        },
      ],
    },
  },
  {
    type: 'paragraph',
  },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Inline Content:',
        styles: { bold: true },
      },
    ],
  },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Styled Text',
        styles: {
          bold: true,
          italic: true,
          textColor: 'red',
          backgroundColor: 'blue',
        },
      },
      {
        type: 'text',
        text: ' ',
        styles: {},
      },
      {
        type: 'link',
        content: 'Link',
        href: 'https://www.blocknotejs.org',
      },
    ],
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
