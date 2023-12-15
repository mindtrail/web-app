import { Tag } from '@prisma/client'
import prisma from '@/lib/db/connection'

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

  console.log('TAGS', createdTagRecords)

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
