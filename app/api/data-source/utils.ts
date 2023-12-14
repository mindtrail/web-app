import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

import { createAndStoreVectors } from '@/lib/qdrant'

import { sumarizePage, getPageTags } from '@/lib/openAI'
import { cleanContent } from '@/lib/loaders/htmlLoader'
import { createTags } from '@/lib/db/tags'

import { getChunksFromHTML } from '@/lib/loaders/htmlLoader'
import { createDataSource, updateDataSource } from '@/lib/db/dataSource'

export const processHTMLPage = async (file: HTMLFile, userId: string) => {
  const { fileName, html, metadata } = file

  const { chunks, sumaryContent } = await getChunksFromHTML(file)
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
    name: fileName,
    type: DataSourceType.web_page,
    nbChunks,
    textSize,
    summary,
    content: cleanContent(html),
    ...metadata,
  }

  const dataSource = await createDataSource(dataSourcePayload)
  const dataSourceId = dataSource?.id

  if (!dataSourceId) {
    return null
  }

  await createTags({ tags, dataSourceId })

  return chunks
    .map(({ pageContent, metadata }) => ({
      pageContent,
      metadata: {
        ...metadata,
        dataSourceId,
        userId,
        type: DataSourceType.web_page,
        tags,
      },
    }))
    .filter((doc) => doc !== null) as Document[]
}

export const storeVectorsAndUpdateDataSource = async (docs: Document[]) => {
  await createAndStoreVectors({ docs })

  // Update the dataSource status to synched for each doc
  docs.map(({ metadata }) => {
    const { dataSourceId } = metadata
    updateDataSource({ id: dataSourceId, status: DataSourceStatus.synched })
  })
}
