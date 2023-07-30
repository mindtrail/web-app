import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { EPubLoader } from 'langchain/document_loaders/fs/epub'

import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

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
    | typeof EPubLoader
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
  'application/epub+zip': EPubLoader,
  'text/markdown': TextLoader,
  'text/plain': TextLoader,
  'application/pdf': PDFLoader,
  'application/json': JSONLoader,
  'application/x-ndjson': JSONLinesLoader,
  'application/x-subrip': SRTLoader,
  'application/octet-stream': TextLoader,
}

type MULTER_FILE = Express.Multer.File

export const getDocumentChunks = async (file: MULTER_FILE): Promise<Document[]> => {
  const { mimetype, originalname } = file

  const blob = await getBlobFromBuffer(file)
  console.log('BLOB', blob)

  try {
    const fileLoader = getFileLoader(blob, mimetype)

    if (!fileLoader) {
      throw new Error('Unsupported file type')
    }

    let loadedFile
    loadedFile = await fileLoader.load()

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 150,
    })

    // @TODO: For PDFs and EPUBs, read the content twice, once with page splitting and once without
    // Create the chunks from the non-split content, and add the page numbers to the metadata from the page-split version

    if (!loadedFile) {
      throw new Error('Error loading file')
    }

    const chunks = (await textSplitter.splitDocuments(loadedFile)).map((chunk) => {
      chunk.metadata.fileName = originalname
      return chunk
    })

    return chunks
  } catch (error) {
    console.error('Error loading file', error)
    return []
  }
}

const getFileLoader = (filepath: Blob, type: string) => {
  const FileLoader = LOADER[type]

  if (!FileLoader) {
    return
  }

  // @TODO: Read content twice for PDFs and EPUBs
  const options = {
    // splitChapters: false,
    // splitPages: false,
  }

  // @ts-ignore
  return new FileLoader(filepath)
}

async function getBlobFromBuffer(file: Express.Multer.File): Promise<Blob> {
  const fileBuffer = file.buffer
  const blob = new Blob([fileBuffer], { type: file.mimetype })
  return blob
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
