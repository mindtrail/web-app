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
}: GetChunksFromDocProps): Promise<
  Document[] | Error | HTMLChunkingResponse
> => {
  console.log('getChunksFromDoc', file, type)

  // const { html, fileName, metadata } = file
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
      chunkSize: 1000, // = 1500/5 = 300 tokens
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
      // chunkHeader: `${fileName}. `,
    }

    const chunks = (
      await chunkTextSpliter.splitDocuments(initialChunks, chunkHeaderOptions)
    ).map(({ pageContent, metadata }) => {
      return {
        metadata: {
          ...metadata,
          // fileName,
        },
        pageContent: formatChunkForEmbedding(pageContent),
      }
    })

    return chunks
  } catch (e: any) {
    console.error('ERRRRRR ----+++ ', e)
    return new Error(e)
  }
}
