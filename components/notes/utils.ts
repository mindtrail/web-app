// @ts-nocheck

import { EditorConfig, OutputData } from '@editorjs/editorjs' // @ts-ignore
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Paragraph from '@editorjs/paragraph'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
// import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
// import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'

export const EDITORJS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  embed: Embed,
  table: Table,
  // warning: Warning,
  code: Code,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: '/api/fetch-metadata', // Your backend endpoint for url data fetching,
    },
  }, // image: Image,
  raw: Raw,
  quote: Quote,
  marker: Marker,
  checklist: {
    class: CheckList,
    inlineToolbar: ['link', 'bold', 'italic'],
  },
  delimiter: Delimiter,
  // inlineCode: InlineCode,
  simpleImage: SimpleImage,
}

const mockData = [
  {
    type: 'header',
    data: {
      text: 'A heading',
      level: 2,
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Paragraph with some <b>bold</b>&nbsp;text. And <a href="https://google.com">some</a> <i>italic</i>&nbsp;text.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'A lovely editor I must say.',
    },
  },
  {
    type: 'paragraph',
    data: {
      text: 'Save new data.',
    },
  },
  {
    type: 'table',
    data: {
      content: [
        ['Col 1', 'Col 2'],
        ['Cell 1', 'Cell 2'],
        ['Cell 3', 'Cell 4'],
      ],
    },
  },
  // {
  //   type: 'quote',
  //   data: {
  //     text: 'A quote',
  //     caption: 'With a caption',
  //     alignment: 'left',
  //   },
  // },
  {
    type: 'checklist',
    data: {
      items: [
        {
          text: 'Check 1',
          checked: false,
        },
        {
          text: 'Check 2',
          checked: true,
        },
        {
          text: 'Check 3',
          checked: false,
        },
      ],
    },
  },
  // {
  //   type: 'simpleImage',
  //   data: {
  //     url: 'https://thedriven.io/wp-content/uploads/2020/01/Model-Y-Side-Blue.jpg',
  //     caption: 'Paste image URL',
  //   },
  // },
]

const DEFAULT_INITIAL_DATA: OutputData = {
  time: new Date().getTime(),
  blocks: mockData,
}

export const EDITORJS_CONFIG: EditorConfig = {
  autofocus: true,
  data: DEFAULT_INITIAL_DATA,
  tools: EDITORJS_TOOLS,
}
