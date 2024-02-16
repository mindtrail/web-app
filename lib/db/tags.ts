import prisma from '@/lib/db/connection'
import { DataSourceTag, Tag, DataSource } from '@prisma/client'

type TagsPayload = {
  userId: string
  tagId: string
}

export const getTagDbOp = async ({ tagId }: TagsPayload) => {
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
export const getTagWithDataSourcesDbOp = async ({ userId, tagId }: TagsPayload) => {
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

export const createTagsAndBindToDataSourceDbOp = async ({
  tags,
  dataSourceId,
}: CreateTagsPayload) => {
  return await prisma.$transaction(async (prisma) => {
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
  })
}

export const createTagDbOp = async ({ name }: { name: string }) => {
  return await prisma.tag.upsert({
    where: {
      name,
    },
    create: {
      name,
      domain: 'new',
    },
    update: {
      name,
    },
  })
}

type UpdateTag = {
  tagId: string
  userId: string
  name: string
}
export const updateTagDbOp = async ({ tagId, name }: UpdateTag) => {
  return await prisma.tag.update({
    where: { id: tagId },
    data: { name },
  })
}

export const deleteTagDbOp = async ({ tagId }: TagsPayload) => {
  return await prisma.$transaction(async (prisma) => {
    // Delete the tag and it's m2m relationships
    await prisma.dataSourceTag.deleteMany({
      where: { tagId },
    })

    return await prisma.tag.delete({
      where: { id: tagId },
    })
  })
}

type AddTagToDataSources = {
  tagId: string
  dataSourceIdList: string[]
}

export const addTagToDataSourcesDbOp = async (props: AddTagToDataSources) => {
  const { tagId, dataSourceIdList } = props

  return await prisma.dataSourceTag.createMany({
    data: dataSourceIdList.map((dataSourceId) => ({
      tagId,
      dataSourceId,
    })),
    skipDuplicates: true,
  })
}
