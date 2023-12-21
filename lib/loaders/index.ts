import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

import { createAndStoreVectors } from '@/lib/qdrant'

import { createTags } from '@/lib/db/tags'
import { getPageTags } from '@/lib/openAI'
import { createDataSource, updateDataSource } from '@/lib/db/dataSource'

type CreateDSProps = {
  file: File | HTMLFile
  userId: string
  chunks: Document[]
  DSType: DataSourceType
}

export const createDataSourceAndVectors = async (
  props: CreateDSProps,
): Promise<Document[] | null> => {
  let { file, userId, chunks, DSType } = props

  const dataSource = await createDataSource(props)

  if (!dataSource) {
    return null
  }

  const { id: dataSourceId, description } = dataSource

  let tags: string[] = []
  // PDFs may have
  if (DSType === DataSourceType.file) {
    const { type } = file as File

    if (type === 'application/pdf') {
      tags = chunks[0]?.metadata?.tags || []
    }
  }

  if (!tags.length) {
    tags = await getPageTags(description || '')
    console.log(2222, tags)
  }

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
        type: DSType,
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

// function
