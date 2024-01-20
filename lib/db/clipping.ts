import prisma from '@/lib/db/connection'

export async function getAllClippings(userId: string) {
  const clippings = await prisma.clipping.findMany({
    where: {
      authorId: userId,
    },
  })
  return clippings
}

export async function createClipping(payload: SaveClipping) {
  console.log('createClipping', payload)
  const { content, selector, dataSourceId, userId } = payload

  const newClipping = await prisma.clipping.create({
    data: {
      authorId: userId,
      content,
      dataSourceId,
      selector: JSON.stringify(selector),
    },
  })

  return newClipping
}
