import { createSuggestionItems } from 'novel/extensions'
import { Icon } from '@/components/ui/icons'

export const suggestionItems = createSuggestionItems([
  {
    title: 'AI Generation',
    description: 'Add a generation tag',
    searchTerms: ['generation', 'AI'],
    icon: <Icon name='Sparkles' />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)

        .run()
    },
  },
  {
    title: 'URL',
    description: 'Add a URL to scrape',
    searchTerms: ['url', 'scrape', 'web'],
    icon: <Icon name='Globe' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setURL().run()
    },
  },
  {
    title: 'Text',
    description: 'Just start typing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: <Icon name='Text' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run()
    },
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: <Icon name='SquareCheckBig' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'big', 'large'],
    icon: <Icon name='Heading1' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'medium'],
    icon: <Icon name='Heading2' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['subtitle', 'small'],
    icon: <Icon name='Heading3' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['unordered', 'point'],
    icon: <Icon name='List' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['ordered'],
    icon: <Icon name='ListOrdered' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    searchTerms: ['blockquote'],
    icon: <Icon name='TextQuote' />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .toggleBlockquote()
        .run(),
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    searchTerms: ['codeblock'],
    icon: <Icon name='Code' />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'File',
    description: 'Upload a file from your computer.',
    searchTerms: [
      'file',
      'document',
      'media',
      'pdf',
      'doc',
      'docx',
      'photo',
      'image',
      'xlsx',
      'xls',
      'csv',
    ],
    icon: <Icon name='File' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setFileUpload().run()

      // upload image
      // const input = document.createElement('input')
      // input.type = 'file'
      // input.accept = 'image/*'
      // input.onchange = async () => {
      //   if (input.files?.length) {
      //     const file = input.files[0]
      //     const pos = editor.view.state.selection.from
      //     handleImageUpload(file, editor.view, pos)
      //   }
      // }
      // input.click()
    },
  },
  {
    title: 'Send Feedback',
    description: 'Let us know how we can improve.',
    icon: <Icon name='MessageSquarePlus' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      const subject = encodeURIComponent('Feedback')
      const body = encodeURIComponent('I have some feedback:')
      window.location.href = `mailto:dan.pausan@gmail.com?subject=${subject}&body=${body}`
    },
  },
  {
    title: 'Horizontal Rule',
    description: 'Add a horizontal rule.',
    icon: <Icon name='Minus' />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
])
