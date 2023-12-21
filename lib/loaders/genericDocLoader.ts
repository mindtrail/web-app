import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { DataSourceType } from '@prisma/client'

import { getChunksFromLocalFile } from '@/lib/loaders/localFileLoader'
import { getChunksFromHTML } from '@/lib/loaders/htmlLoader'

import { formatChunkForEmbedding } from '@/lib/loaders/utils'

type GetChunksFromDocProps = {
  file: File | HTMLFile
  type: string
}

export const getChunksFromDoc = async ({
  file,
  type,
}: GetChunksFromDocProps): Promise<HTMLChunkingResponse> => {
  const { name } = file

  const metadata =
    type === DataSourceType.web_page ? (file as HTMLFile).metadata : {}
  const chunkHeader = `${metadata?.title || name}. `

  const loadedDoc =
    type === DataSourceType.web_page
      ? await getChunksFromHTML(file as HTMLFile)
      : await getChunksFromLocalFile(file as File)

  const bulkTextSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000, // average page length
    chunkOverlap: 0,
    separators: ['\n\n'], // only split by new paragraphs
  })

  const chunkTextSpliter = new RecursiveCharacterTextSplitter({
    chunkSize: 1250, // ~250 tokens (5 chars per token)
    chunkOverlap: 100,
    separators: ['\n\n', '.', '!', '?', '...'], // final split
  })

  const initialChunks = (await bulkTextSplitter.splitDocuments(loadedDoc)).map(
    ({ pageContent, metadata }) => {
      return {
        metadata,
        pageContent: formatChunkForEmbedding(pageContent),
      }
    },
  )

  const chunkHeaderOptions = { chunkHeader }

  const chunks = (
    await chunkTextSpliter.splitDocuments(initialChunks, chunkHeaderOptions)
  ).map(({ pageContent, metadata }) => {
    // Remove blobType and source properties
    // Create a copy of metadata to avoid mutating the original object
    const metadataCopy = { ...metadata }

    delete metadataCopy.blobType
    delete metadataCopy.source

    return {
      metadata: {
        ...metadataCopy,
        name,
      },
      pageContent: formatChunkForEmbedding(pageContent),
    }
  })

  console.log('Chunks', chunks.length)
  return { chunks }
}
