import prisma from '@/lib/db/connection'

type CreateTagsPayload = {
  tags: string[]
  dataSourceId: string
}

export const getTagList = async () => {
  const tagList = await prisma.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return tagList
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

  console.log('TAGS created:: ', createdTagRecords)

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
