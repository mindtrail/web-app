import prisma from '@/lib/db/connection'
import { DataSourceTag, Tag, DataSource } from '@prisma/client'

type GetTagsPayload = {
  userId: string
  tagId: string
}

export const getTagDbOp = async ({ tagId }: GetTagsPayload) => {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  })

  return tag
}

export const getTagsListDbOp = async () => {
  const tagList = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })

  return tagList
}

type TagWithDataSources = Tag & {
  dataSourceTags: (DataSourceTag & {
    dataSource: DataSource
  })[]
}
export const getTagWithDataSourcesDbOp = async ({ userId, tagId }: GetTagsPayload) => {
  const tag = (await prisma.tag.findUnique({
    where: { id: tagId },
    include: {
      dataSourceTags: {
        include: { dataSource: true },
        orderBy: { dataSource: { createdAt: 'desc' } },
      },
    },
  })) as TagWithDataSources

  if (!tag) {
    return null
  }
  const { dataSourceTags, ...rest } = tag
  const dataSources = dataSourceTags.map((item) => item?.dataSource)

  return {
    ...rest,
    dataSources,
  }
}

type CreateTagsPayload = {
  tags: string[]
  dataSourceId: string
}

export const createTags = async ({ tags, dataSourceId }: CreateTagsPayload) => {
  // @TODO -> determine the domain of the tags. Add guardrails
  const tagsArray = tags.map((tag) => ({
    name: tag,
    domain: 'general',
  }))

  await prisma.tag.createMany({
    data: tagsArray,
    skipDuplicates: true,
  })

  const createdTagRecords = await prisma.tag.findMany({
    where: {
      name: { in: tags },
    },
  })

  console.log('TAGS created:: ', createdTagRecords?.length)

  for (const tag of createdTagRecords) {
    await prisma.dataSourceTag.create({
      data: {
        tagId: tag.id,
        dataSourceId: dataSourceId,
      },
    })
  }

  return createdTagRecords
}
