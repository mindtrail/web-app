import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { TextLoader } from 'langchain/document_loaders/fs/text'

import { Document } from 'langchain/document'
// import { EPubLoader } from 'langchain/document_loaders/fs/epub'

const LOADER: FILE_LOADER_PAIR = {
  'text/csv': CSVLoader,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    DocxLoader,
  // 'application/epub+zip': EPubLoader,
  'text/markdown': TextLoader,
  'text/plain': TextLoader,
  'application/pdf': PDFLoader,
  'application/json': JSONLoader,
  'application/x-ndjson': JSONLinesLoader,
  'application/x-subrip': SRTLoader,
  'application/octet-stream': TextLoader,
}

const getFileLoader = (type: string) => {
  const FileLoader = LOADER[type]

  if (!FileLoader) {
    return
  }

  // @TODO: Read content twice for PDFs and EPUBs
  // Create the chunks from the non-split content.
  // But add the page numbers to the metadata from the page-split version
  // const options = { splitChapters: false, splitPages: false }
  return FileLoader
}

export const getChunksFromLocalFile = async (
  fileBlob: File,
): Promise<Document[]> => {
  const { type } = fileBlob

  const FileLoader = getFileLoader(type)

  if (!FileLoader) {
    throw new Error('Unsupported file type', { cause: 'unsupported_file_type' })
  }

  // @ts-ignore
  const loader = new FileLoader(fileBlob)
  const loadedDoc = await loader.load()

  return loadedDoc
}
