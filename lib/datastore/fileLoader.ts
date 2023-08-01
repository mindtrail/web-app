import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// import { EPubLoader } from 'langchain/document_loaders/fs/epub'

import { FILE_LOADER_PAIR } from '@/types/fileLoader'

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

export const getDocumentChunks = async (fileBlob: Blob): Promise<Document[]> => {
  const { name: fileName, type } = fileBlob

  try {
    const fileLoader = getFileLoader(fileBlob, type)

    if (!fileLoader) {
      throw new Error('Unsupported file type')
    }

    const loadedFile = await fileLoader.load()
    if (!loadedFile) {
      throw new Error('Error loading file')
    }

    // @TODO: For PDFs and EPUBs, read the content twice, once with page splitting and once without
    // Create the chunks from the non-split content, and add the page numbers to the metadata from the page-split version

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 150,
      separators: ['\n\n', '\n', '?', '!', '...', '.'],
    })

    const chunkHeaderOptions = {
      chunkHeader: `File ${fileName} `,
    }

    const chunks = (await textSplitter.splitDocuments(loadedFile, chunkHeaderOptions)).map(
      ({ pageContent, metadata }) => {
        return {
          metadata: {
            ...metadata,
            fileName,
          },
          pageContent: pageContent.replace(/\s+/g, ' ').trim(),
        }
      },
    )

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
  // const options = { splitChapters: false, splitPages: false }

  // @ts-ignore
  return new FileLoader(filepath)
}

// const UNSTRUCTURED_API_FILETYPES = [
//   '.txt',
//   '.text',
//   '.pdf',
//   '.docx',
//   '.doc',
//   '.jpg',
//   '.jpeg',
//   '.eml',
//   '.html',
//   '.htm',
//   '.md',
//   '.pptx',
//   '.ppt',
//   '.msg',
//   '.rtf',
//   '.xlsx',
//   '.xls',
//   '.odt',
//   '.epub',
// ]
