import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { TextLoader } from 'langchain/document_loaders/fs/text'

import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// import { EPubLoader } from 'langchain/document_loaders/fs/epub'

import { formatChunkForEmbedding } from '@/lib/loaders/utils'

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

export const getChunksFromFile = async (
  fileBlob: File,
): Promise<Document[] | Error> => {
  const { name: fileName, type } = fileBlob

  try {
    const FileLoader = getFileLoader(type)

    if (!FileLoader) {
      throw new Error('Unsupported file type')
    }

    // @ts-ignore
    const loader = new FileLoader(fileBlob)
    const loadedDoc = await loader.load()

    if (!loadedDoc) {
      throw new Error('Error loading file')
    }

    const bulkTextSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 3000, // average page length
      chunkOverlap: 0,
      separators: ['\n\n'], // only split by new paragraphs
    })

    const chunkTextSpliter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500, // = 1500/5 = 300 tokens
      chunkOverlap: 100,
      separators: ['\n\n', '.', '!', '?', '...'], // final split
    })

    const initialChunks = (
      await bulkTextSplitter.splitDocuments(loadedDoc)
    ).map(({ pageContent, metadata }) => {
      return {
        metadata,
        pageContent: formatChunkForEmbedding(pageContent),
      }
    })

    const chunkHeaderOptions = {
      chunkHeader: `${fileName}. `,
    }

    const chunks = (
      await chunkTextSpliter.splitDocuments(initialChunks, chunkHeaderOptions)
    ).map(({ pageContent, metadata }) => {
      return {
        metadata: {
          ...metadata,
          fileName,
        },
        pageContent: formatChunkForEmbedding(pageContent),
      }
    })

    return chunks
  } catch (error) {
    console.error('Error loading file', error)

    return error as Error
  }
}
