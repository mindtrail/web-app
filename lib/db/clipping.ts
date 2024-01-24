import prisma from '@/lib/db/connection'

export async function getClippingList(userId: string) {
  const clippings = await prisma.clipping.findMany({
    where: {
      authorId: userId,
    },
    include: {
      dataSource: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  return clippings
}

export async function createClipping(payload: SavedClipping) {
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

export async function deleteClipping(userId: string, clippingId: string) {
  const deletedClipping = await prisma.clipping.delete({
    where: {
      authorId: userId,
      id: clippingId,
    },
  })

  return deletedClipping
}
