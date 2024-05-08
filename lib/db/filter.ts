import { prisma } from '@/lib/db/connection'
// import { getDataSourceListByIds } from './dataSource'
// import { Filter, DataSource } from '@prisma/client'

type FilterListProps = {
  userId: string | undefined
  includeDataSource?: boolean
}

export const getFilterListDbOp = async ({ userId }: FilterListProps) => {
  // Fetch data using Prisma based on the user
  const filterList = await prisma.filter.findMany({
    where: { ownerId: userId },
  })

  return filterList
}

type GetFilterProps = {
  userId: string
  filterId: string
}

export const getFilterDbOp = async ({ userId, filterId }: GetFilterProps) => {
  // Fetch data using Prisma based on the user
  const filter = await prisma.filter.findUnique({
    where: { ownerId: userId, id: filterId },
  })

  return filter
}

export const createFilterDbOp = async ({ userId, name }: CreateFilter) => {
  // Check if a filter with the specified name already exists for the user
  const nameExists = await prisma.filter.findFirst({
    where: {
      name,
      ownerId: userId,
    },
  })

  if (nameExists) {
    // If it exists, append a random string or an index to make it unique
    name = `${name}-${Math.floor(Math.random() * 90000 + 10000)}` // appending a random 5 char nr
  }

  const filter = await prisma.filter.create({
    // @ts-ignore - Prisma types are not recognizing the connect field
    data: {
      name,
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  })

  return filter
}

export const updateFilterDbOp = async ({ filterId, userId, ...rest }: UpdateFilter) => {
  const filter = await prisma.filter.update({
    where: {
      id: filterId,
      ownerId: userId,
    },
    data: {
      ...rest,
    },
  })

  console.log('UPDATE --- ', rest, filter)
  return filter
}

export const deleteAllFiltersForUser = async (userId: string) => {
  const filter = await prisma.filter.deleteMany({
    where: {
      ownerId: userId,
    },
  })

  return filter
}

export const deleteFilterDbOp = async (userId: string, filterId: string) => {
  // Delete all data sources for the filter
  const filter = await prisma.filter.delete({
    where: {
      id: filterId,
      ownerId: userId,
    },
  })

  return filter
}
