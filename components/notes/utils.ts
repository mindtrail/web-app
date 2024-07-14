export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Run your flow like you say cheese ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://tiptap.dev/',
                target: '_blank',
              },
            },
          ],
          text: 'Tiptap',
        },
        { type: 'text', text: ' + ' },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://sdk.vercel.ai/docs',
                target: '_blank',
              },
            },
          ],
          text: 'Vercel AI SDK',
        },
        { type: 'text', text: '.' },
      ],
    },
  ],
}
