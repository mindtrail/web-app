import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { Document } from 'langchain/document'
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
}: GetChunksFromDocProps): Promise<Error | HTMLChunkingResponse> => {
  // const { html, name, metadata } = file
  // const { title = '', description = '' } = metadata

  try {
    const loadedDoc =
      type === DataSourceType.web_page
        ? await getChunksFromHTML(file as HTMLFile)
        : await getChunksFromLocalFile(file as File)

    // TODO: Test this
    if (loadedDoc instanceof Error) {
      throw loadedDoc
    }

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

    const initialChunks = (
      await bulkTextSplitter.splitDocuments(loadedDoc)
    ).map(({ pageContent, metadata }) => {
      return {
        metadata,
        pageContent: formatChunkForEmbedding(pageContent),
      }
    })

    const chunkHeaderOptions = {
      // chunkHeader: `${name}. `,
    }

    const chunks = (
      await chunkTextSpliter.splitDocuments(initialChunks, chunkHeaderOptions)
    ).map(({ pageContent, metadata }) => {
      return {
        metadata: {
          ...metadata,
          // name,
        },
        pageContent: formatChunkForEmbedding(pageContent),
      }
    })

    console.log('Chunks', chunks.length)

    return { chunks }
  } catch (e: any) {
    console.error('ERRRRRR ----+++ ', e)
    return new Error(e)
  }
}
