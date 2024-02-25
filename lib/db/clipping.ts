import prisma from '@/lib/db/connection'

export async function getClippingList(userId: string, groupByDataSource: boolean) {
  if (groupByDataSource) {
    // Prisma does not support group by for nested queries.
    // Used raw sql + build in Postgress json functions to do it
    return await await prisma.$queryRaw`
      SELECT
        d.name as "dataSourceName",
        json_agg(c) as "clippingList"
      FROM
        "Clippings" c
      INNER JOIN
        "DataSources" d ON c."dataSourceId" = d.id
      WHERE
        c."authorId" = ${userId}
      GROUP BY
        d.name
    `
  }

  return await prisma.clipping.findMany({
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

type DeleteProps = {
  userId: string
  clippingIdList: string[]
}
export async function deleteClippingDbOp({ userId, clippingIdList }: DeleteProps) {
  const deletedClipping = await prisma.clipping.deleteMany({
    where: {
      authorId: userId,
      id: { in: clippingIdList },
    },
  })

  return deletedClipping
}
