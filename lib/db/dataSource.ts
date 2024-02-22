import { DataSource, DataSourceType, CollectionDataSource } from '@prisma/client'
import prisma from '@/lib/db/connection'
import { Document } from 'langchain/document'

import { getURLDisplayName } from '@/lib/utils'
import { cleanHTMLContent } from '@/lib/loaders/utils'
import { summarizePage } from '@/lib/openAI'

type GetDataSourceList = {
  userId: string
  collectionId?: string
  tagId?: string
  containClippings?: boolean
}

export const getDataSourceListDbOp = async (props: GetDataSourceList) => {
  const { userId, collectionId, tagId, containClippings } = props

  const dataSourceList = await prisma.dataSource.findMany({
    where: {
      dataSourceUsers: { some: { userId } },
      collectionDataSource: collectionId ? { some: { collectionId: collectionId } } : {},
      dataSourceTags: tagId ? { some: { tagId } } : {},
      clippings: containClippings ? { some: {} } : {},
    },
    include: {
      clippings: true,
      dataSourceTags: { include: { tag: true } },
      collectionDataSource: { include: { collection: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return dataSourceList
}

export const getDataSourceListByIds = async (
  dataSourceList: string[],
  userId?: string,
) => {
  const result = await prisma.dataSource.findMany({
    where: {
      id: { in: dataSourceList },
      dataSourceUsers: { some: { userId: userId } },
    },
    include: { dataSourceTags: { include: { tag: true } } },
  })

  // Sort the result based on the order in dataSourceList
  const sortedResult = dataSourceList
    .map((id) => result.find((dataSource) => dataSource.id === id))
    .filter(Boolean)

  return sortedResult
}

export const getDataSourceById = async (dataSourceId: string) => {
  const dataSource = await prisma.dataSource.findUnique({
    where: {
      id: dataSourceId,
    },
  })

  return dataSource
}

export const checkDataSourceExists = async (name: string, userId: string) => {
  // check if datasource exists for the logged in user
  const dataSource = await prisma.dataSource.findFirst({
    where: {
      name,
      dataSourceUsers: { some: { userId } },
    },
  })

  return dataSource
}

type CreateDataSourcePayload = Pick<
  DataSource,
  'type' | 'name' | 'nbChunks' | 'textSize'
> &
  Partial<Pick<DataSource, 'displayName' | 'status'>> & {
    userId: string
  }

type CreateDS = {
  file: File | HTMLFile
  userId: string
  chunks: Document[]
  DSType: DataSourceType
  uniqueName?: boolean
}

export const createDataSource = async (props: CreateDS) => {
  let { file, userId, chunks, DSType, uniqueName = false } = props

  const { name } = file

  let dataSourceContent = ''
  let metadata = {}
  let description = ''

  if (DSType === DataSourceType.file) {
    file = file as File

    // For PDFs, we may have metadata coming from the PDF itself
    const PDFMetadata =
      file.type === 'application/pdf' ? getMetadataFromChunk(chunks[0]) : {}

    if (!PDFMetadata?.description) {
      description = await summarizePage(chunks[0]?.pageContent)
    }

    metadata = {
      title: name,
      description,
      ...PDFMetadata,
    }
  }

  if (DSType === DataSourceType.web_page) {
    file = file as HTMLFile
    // Only store the content for web pages as it can be too large for local files
    dataSourceContent = cleanHTMLContent(file.html)

    let { url, title, description, ...restMetadata } = file.metadata

    console.log('file description:: ', description)

    title = title || name
    description =
      description || (await summarizePage(dataSourceContent.substring(0, 2000)))

    metadata = {
      ...restMetadata,
      title,
      description,
    }
  }

  const nbChunks = chunks.length
  const textSize = chunks.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

  if (!nbChunks || !textSize) {
    return null
  }

  const displayName = DSType === DataSourceType.web_page ? getURLDisplayName(name) : name

  const dataSourcePayload = {
    name,
    nbChunks,
    textSize,
    type: DSType,
    content: dataSourceContent,
    displayName,
    ...metadata,
  }

  if (uniqueName) {
    const existingDataSource = await prisma.dataSource.findFirst({
      where: { name },
    })
    if (existingDataSource) {
      const { id } = existingDataSource
      return updateDataSource({ id, ...dataSourcePayload })
    }
  }

  const dataSource = await prisma.dataSource.create({
    data: {
      ...dataSourcePayload,
      dataSourceUsers: {
        create: { user: { connect: { id: userId } } },
      },
    },
  })

  return dataSource
}

type UpdateDataSourcePayload = {
  id: string
} & Partial<CreateDataSourcePayload>

export const updateDataSource = async (payload: UpdateDataSourcePayload) => {
  const { id, ...data } = payload

  const dataSource = await prisma.dataSource.update({
    where: { id },
    data,
  })

  return dataSource
}

export const deleteDataSourceDbOp = async (
  dataSourceIdList: string[],
  userId: string,
) => {
  // Start a transaction
  return await prisma.$transaction(async (prisma) => {
    // Step 1: Delete the m2m relationship between dataSources & users / collections
    const deleteDSUserConnection = prisma.dataSourceUser.deleteMany({
      where: {
        dataSourceId: { in: dataSourceIdList },
        userId,
      },
    })

    const deleteDSCollectionsConnection = prisma.collectionDataSource.deleteMany({
      where: {
        dataSourceId: { in: dataSourceIdList },
      },
    })

    const [userRes, collRes] = await Promise.all([
      deleteDSUserConnection,
      deleteDSCollectionsConnection,
    ])
    console.log(
      'deleteDSUserConnection:::',
      userRes.count,
      'deleteDSCollectionConnection:::',
      collRes.count,
    )

    // Step 2: Retrieve only the DS that don't have a user associated with.
    const dataSourcesWithNoUser = await prisma.dataSource.findMany({
      where: {
        id: { in: dataSourceIdList },
        dataSourceUsers: { none: {} },
      },
    })

    // Step 3: Delete those dataSource
    const response = await prisma.dataSource.deleteMany({
      where: {
        id: {
          in: dataSourcesWithNoUser.map((dataSource) => dataSource.id),
        },
      },
    })

    if (response.count !== dataSourcesWithNoUser.length) {
      throw new Error('Not all dataSources were deleted')
    }

    console.log(
      'dataSourceDeleted:::',
      response.count,
      dataSourcesWithNoUser.map((dataSource) => dataSource.id),
    )
    return dataSourcesWithNoUser
  })
}

function getMetadataFromChunk(chunk: Document): Partial<BrowserExtensionData> {
  const { metadata } = chunk
  if (!metadata) {
    return {}
  }

  const { title, description, image } = metadata
  return {
    ...(title && { title }),
    ...(description && { description }),
    ...(image && { image }),
  }
}

export const addDataSourcesToCollectionDbOp = async (
  dataSourceIds: string[],
  collectionId: string,
) => {
  return await prisma.collectionDataSource.createMany({
    data: dataSourceIds.map((dataSourceId) => ({
      dataSourceId,
      collectionId,
    })),
    skipDuplicates: true,
  })
}

export const removeDataSourceFromCollectionDbOp = async (
  dataSourceIds: string[],
  collectionId: string,
) => {
  return await prisma.collectionDataSource.deleteMany({
    where: {
      collectionId,
      dataSourceId: { in: dataSourceIds },
    },
  })
}

export const getCollectionsForDataSourceListDbOp = async (dataSourceIdList: string[]) => {
  // Check if dataSourceIdList is a valid, non-empty array
  if (!Array.isArray(dataSourceIdList) || dataSourceIdList.length === 0) {
    return [] // Return an empty array if no valid dataSourceIdList are provided
  }

  const idListString = dataSourceIdList.map((id) => `'${id}'`).join(', ')
  const query = `
    SELECT c.id
    FROM "Collections" c

    JOIN "CollectionDataSource" cds ON c.id = cds."collectionId"
    WHERE cds."dataSourceId" IN (${idListString})

    GROUP BY c.id
    HAVING COUNT(DISTINCT cds."dataSourceId") = ${dataSourceIdList.length}
  `

  const result = await prisma.$queryRawUnsafe(query)
  // @ts-ignore
  return result.map(({ id }) => id)
}
