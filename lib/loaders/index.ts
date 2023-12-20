import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

import { createAndStoreVectors } from '@/lib/qdrant'

import { sumarizePage, getPageTags } from '@/lib/openAI'
import { cleanHTMLContent } from '@/lib/loaders/utils'
import { createTags } from '@/lib/db/tags'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { createDataSource, updateDataSource } from '@/lib/db/dataSource'

type CreateDSProps = {
  file: File | HTMLFile
  type: DataSourceType
  userId: string
}

export const createDataSourceAndVectors = async ({
  file,
  type,
  userId,
}: CreateDSProps) => {
  const name = file.name

  let dataSourceContent = ''
  let metadata = {}

  if (type === DataSourceType.file) {
    file = file as File

    metadata = {
      title: name,
    }
  } else {
    file = file as HTMLFile

    dataSourceContent = cleanHTMLContent(file.html)
    metadata = file.metadata
  }

  const { chunks, sumaryContent = '' } = (await getChunksFromDoc({
    file,
    type,
  })) as HTMLChunkingResponse

  const nbChunks = chunks.length
  const textSize = chunks.reduce(
    (acc, doc) => acc + doc?.pageContent?.length,
    0,
  )

  if (!nbChunks || !textSize) {
    return null
  }

  const summary = await sumarizePage(sumaryContent)
  const tags = await getPageTags(summary)

  // We store the dataSource in the DB. Trying to store the content too, see how large it can be
  const dataSourcePayload = {
    userId,
    name: name,
    type,
    nbChunks,
    textSize,
    summary,
    content: dataSourceContent,
    ...metadata,
  }

  const dataSource = await createDataSource(dataSourcePayload)
  const dataSourceId = dataSource?.id

  if (!dataSourceId) {
    return null
  }

  await createTags({ tags, dataSourceId })

  const docs = chunks
    .map(({ pageContent, metadata }) => ({
      pageContent,
      metadata: {
        ...metadata,
        dataSourceId,
        userId,
        type,
        tags,
      },
    }))
    .filter((doc) => doc !== null) as Document[]

  await storeVectorsAndUpdateDataSource(docs)

  return docs
}

const storeVectorsAndUpdateDataSource = async (docs: Document[]) => {
  try {
    await createAndStoreVectors({ docs })

    // Update the dataSource status to synched for each doc
    docs.map(({ metadata }) => {
      const { dataSourceId } = metadata
      updateDataSource({ id: dataSourceId, status: DataSourceStatus.synched })
    })
  } catch (err) {
    console.error(err)
    // Update the dataSource status to error for each doc
    docs.map(({ metadata }) => {
      const { dataSourceId } = metadata
      updateDataSource({ id: dataSourceId, status: DataSourceStatus.error })
    })
  }
}
