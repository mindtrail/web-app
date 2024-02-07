import { DataSource, DataSourceType } from '@prisma/client'
import prisma from '@/lib/db/connection'
import { Document } from 'langchain/document'

import { getURLDisplayName } from '@/lib/utils'
import { cleanHTMLContent } from '@/lib/loaders/utils'
import { summarizePage } from '@/lib/openAI'

export const getDataSourceListForUser = async (userId: string) => {
  const dataSourceList = await prisma.dataSource.findMany({
    where: {
      dataSourceUsers: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      dataSourceTags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return dataSourceList
}

export const getDataSourceListByIds = async (
  dataSourceList: string[],
  userId?: string,
) => {
  const result = await prisma.dataSource.findMany({
    where: {
      id: {
        in: dataSourceList,
      },
      dataSourceUsers: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      dataSourceTags: {
        include: {
          tag: true,
        },
      },
    },
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
      dataSourceUsers: {
        some: {
          userId,
        },
      },
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
        create: {
          user: {
            connect: { id: userId },
          },
        },
      },
    },
  })

  return dataSource
}

type UpdateDataSourcePayload = {
  id: string
} & Partial<CreateDataSourcePayload>

export const updateDataSource = async (payload: UpdateDataSourcePayload) => {
  const { id, ...rest } = payload

  const dataSource = await prisma.dataSource.update({
    where: {
      id,
    },
    data: {
      ...rest,
    },
  })

  return dataSource
}

export const deleteDataSourceDbOp = async (
  dataSourceIdList: string[],
  userId: string,
) => {
  // Step 1: Delete the m2m relationship between the user and the dataSource
  await prisma.dataSourceUser.deleteMany({
    where: {
      dataSourceId: {
        in: dataSourceIdList,
      },
      userId,
    },
  })

  const dataSourcesToDeleteFromDB = await prisma.dataSource.findMany({
    where: {
      id: {
        in: dataSourceIdList,
      },
      dataSourceUsers: {
        none: {},
      },
    },
  })

  // Step 2: Delete the dataSource if there are no more users associated with it

  await prisma.dataSource.deleteMany({
    where: {
      id: {
        in: dataSourcesToDeleteFromDB.map((dataSource) => dataSource.id),
      },
    },
  })

  console.log(
    'dataSourceDeleted:::',
    dataSourcesToDeleteFromDB.map((dataSource) => dataSource.id),
  )
  return dataSourcesToDeleteFromDB
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
