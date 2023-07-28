import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
// import { EPubLoader } from 'langchain/document_loaders/fs/epub'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { TextLoader } from 'langchain/document_loaders/fs/text'
// import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'

type LoaderType = {
  object:
    | typeof CSVLoader
    | typeof DocxLoader
    | typeof JSONLoader
    | typeof JSONLinesLoader
    | typeof PDFLoader
    | typeof SRTLoader
    | typeof TextLoader
}
type FILE_LOADER_PAIR = {
  [key: string]:
    | typeof CSVLoader
    | typeof DocxLoader
    // | typeof EPubLoader
    | typeof JSONLoader
    | typeof JSONLinesLoader
    | typeof PDFLoader
    | typeof SRTLoader
    | typeof TextLoader
  // | typeof UnstructuredLoader
}

const LOADER: FILE_LOADER_PAIR = {
  'text/csv': CSVLoader,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocxLoader,
  // 'application/epub+zip': EPubLoader,
  'text/markdown': TextLoader,
  'text/plain': TextLoader,
  'application/pdf': PDFLoader,
  'application/json': JSONLoader,
  'application/x-ndjson': JSONLinesLoader,
  'application/x-subrip': SRTLoader,
  'application/octet-stream': TextLoader,
}

const UNSTRUCTURED_API_FILETYPES = [
  '.txt',
  '.text',
  '.pdf',
  '.docx',
  '.doc',
  '.jpg',
  '.jpeg',
  '.eml',
  '.html',
  '.htm',
  '.md',
  '.pptx',
  '.ppt',
  '.msg',
  '.rtf',
  '.xlsx',
  '.xls',
  '.odt',
  '.epub',
]

export const getFileLoader = (blob: Blob) => {
  const { type } = blob
  const FileLoader = LOADER[type]

  if (!FileLoader) {
    return
  }

  // @ts-ignore
  return new FileLoader(blob)
}
