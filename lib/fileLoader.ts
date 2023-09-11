import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/document_loaders/fs/srt'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DocumentLoader } from 'langchain/dist/document_loaders/base'

import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// import { EPubLoader } from 'langchain/document_loaders/fs/epub'

const PDF_FILE = 'application/pdf'

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

export const getDocumentChunks = async (fileBlob: Blob | File): Promise<Document[] | Error> => {
  const { name: fileName, type } = fileBlob

  try {
    const fileLoader = getFileLoader(fileBlob, type)

    if (!fileLoader) {
      throw new Error('Unsupported file type')
    }

    console.time('loadFile')
    const loadedDoc = await fileLoader.load()
    console.timeEnd('loadFile')
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

    // const chunkHeaderOptions = {
    // chunkHeader: `File ${fileName} `,
    // }

    console.time('splitDocuments')
    const initialChunks = (await bulkTextSplitter.splitDocuments(loadedDoc)).map(
      ({ pageContent, metadata }) => {
        return {
          metadata,
          pageContent: pageContent
            .replace(/(?<!\n)\n(?!\n)/g, ' ') // Replace single newlines with spaces
            .replace(/\s?-\s?/g, '-') // Fix spacing around dashes
            .replace(/ \./g, '.') // Fix spacing around periods
            .replace(/[‘’]/g, "'") // Normalize curly quotes to straight quotes
            .replace(/[“”]/g, '"') // Normalize curly quotes to straight quotes
            .replace(/ ' /g, "'") // Remove extra spaces around single straight quotes
            .replace(/[ \t]{2,}/g, ' ') // Replace multiple spaces or tabs with a single space, without affecting newlines
            .trim(), // Remove leading and trailing whitespace,
        }
      },
    )

    console.timeEnd('splitDocuments')
    console.time('chunkTextSpliter')

    const chunks = (await chunkTextSpliter.splitDocuments(initialChunks)).map(
      ({ pageContent, metadata }) => {
        return {
          metadata: {
            ...metadata,
            fileName,
          },
          pageContent: pageContent
            .replace(/\s{2,}/g, ' ') // Replace multiple whitespace characters with a single space
            .toLowerCase() // Convert to lowercase
            .replace(/(?<=[\.!?]\s)([a-z])|^([a-z])/g, (_, firstLetter) =>
              firstLetter?.toUpperCase(),
            )
            // Capitalize first letter of each sentence
            .trim(),
        }
      },
    )
    console.timeEnd('chunkTextSpliter')
    return chunks
  } catch (error) {
    console.error('Error loading file', error)
    return error as Error
  }
}

const getFileLoader = (filepath: Blob, type: string) => {
  const FileLoader = LOADER[type]

  if (!FileLoader) {
    return
  }

  // @TODO: Read content twice for PDFs and EPUBs
  // Create the chunks from the non-split content.
  // But add the page numbers to the metadata from the page-split version
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
