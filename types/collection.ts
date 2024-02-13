import { Collection, DataSource } from '@prisma/client'

declare global {
  type CollectionItem = {
    collectionId: string
    name: string
    description: string | null
  }

  type CollectionExtended = Collection & {
    dataSources?: DataSource[]
  }

  type CollectionData = {
    id: string | undefined
    name: string | undefined
    description: string | null | undefined
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

  type AddItemToFolder = {
    existingId?: string
    newFolderName?: string
  }
}
