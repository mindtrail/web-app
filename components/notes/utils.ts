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
import IndentTune from 'editorjs-indent-tune'
import TextAlignment from 'editorjs-text-alignment-blocktune'
import TextVariantTune from '@editorjs/text-variant-tune'
import Strikethrough from '@sotaproject/strikethrough'
import Underline from '@editorjs/underline'
// import AIText from './ai-autocomplete'
// import AIText from '@alkhipce/editorjs-aitext'

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
    tunes: ['textAlign', 'textVariant', 'indentTune'],
  },
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      defaultLevel: 2,
      placeholder: 'Heading...',
    },
    tunes: ['textAlign', 'textVariant', 'indentTune'],
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
    tunes: [],
  },
  embed: {
    class: Embed,
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: '/api/editor/link-embed',
    },
  },
  underline: Underline,
  strikethrough: Strikethrough,
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
    tunes: ['textAlign', 'textVariant', 'indentTune'],
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
