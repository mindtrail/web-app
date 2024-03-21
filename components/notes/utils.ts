// @ts-nocheck

import { EditorConfig, OutputData } from '@editorjs/editorjs' // @ts-ignore
import Header from '@editorjs/header'
import NestedList from '@editorjs/nested-list'
import Paragraph from '@editorjs/paragraph'
import LinkTool from '@editorjs/link'
import LinkAutocomplete from '@editorjs/link-autocomplete'
import Delimiter from '@editorjs/delimiter'
import SimpleImage from '@editorjs/simple-image'
import Embed from '@editorjs/embed'
import EJLaTeX from 'editorjs-latex'
import ChangeCase from 'editorjs-change-case'
import IndentTune from 'editorjs-indent-tune'
import TextAlignment from 'editorjs-text-alignment-blocktune'
import TextVariantTune from '@editorjs/text-variant-tune'

const PLACEHOLDER_MSG = "Write, press 'space' for AI or '/' for more"

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
  // {
  //   type: 'table',
  //   data: {
  //     content: [
  //       ['Col 1', 'Col 2'],
  //       ['Cell 1', 'Cell 2'],
  //       ['Cell 3', 'Cell 4'],
  //     ],
  //   },
  // },
  // {
  //   type: 'quote',
  //   data: {
  //     text: 'A quote',
  //     caption: 'With a caption',
  //     alignment: 'left',
  //   },
  // },
  // {
  //   type: 'checklist',
  //   data: {
  //     items: [
  //       {
  //         text: 'Check 1',
  //         checked: false,
  //       },
  //       {
  //         text: 'Check 2',
  //         checked: true,
  //       },
  //       {
  //         text: 'Check 3',
  //         checked: false,
  //       },
  //     ],
  //   },
  // },
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

const EDITORJS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: {
      placeholder: PLACEHOLDER_MSG,
    },
    tunes: ['textAlign', 'indentTune'],
  },
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      defaultLevel: 2,
      placeholder: 'Heading...',
    },
    tunes: ['textAlign', 'indentTune'],
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
    tunes: [],
  },
  // embed: Embed,
  embed: {
    class: LinkTool,
    config: {
      endpoint: '/api/editor/link-embed', // Your backend endpoint for url data fetching,
    },
  },
  link: {
    class: LinkAutocomplete,
    config: {
      endpoint: '/api/editor/link-autocomplete',
      queryParam: 'url',
    },
  },
  simpleImage: {
    class: SimpleImage,
    tunes: ['textAlign', 'indentTune'],
  },

  delimiter: Delimiter,
  Math: {
    class: EJLaTeX,
    shortcut: 'CMD+SHIFT+M',
    tunes: ['textAlign', 'indentTune'],
  },
  changeCase: {
    class: ChangeCase,
    config: {
      showLocaleOption: true, // enable locale case options
      locale: 'tr', // or ['tr', 'TR', 'tr-TR']
    },
  },
  textVariant: TextVariantTune,

  indentTune: IndentTune,
  textAlign: TextAlignment,
}

export const EDITORJS_CONFIG: EditorConfig = {
  autofocus: true,
  data: DEFAULT_INITIAL_DATA,
  tools: EDITORJS_TOOLS,
}
