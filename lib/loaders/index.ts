import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

import { createAndStoreVectors } from '@/lib/qdrant'

import { sumarizePage, getPageTags } from '@/lib/openAI'
import { createTags } from '@/lib/db/tags'

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
  let { userId, chunks, DSType } = props

  const dataSource = await createDataSource(props)
  const dataSourceId = dataSource?.id

  // @TODO: Use description insted of summary. Generate a summary for local files that don't have that info
  // const summary = await sumarizePage('')
  const tags = await getPageTags('')

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

