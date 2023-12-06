import { Collection, DataSource, DataSourceStatus } from '@prisma/client'

declare global {
  type CollectionExtended = Collection & {
    dataSources: DataSource[]
  }

  type CreateCollection = {
    userId: string
    name: string
    description: string
  }

  type UpdateCollection = Partial<CreateCollection> & {
    collectionId: string
  }
}
