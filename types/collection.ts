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
    name: string
    userId?: string
    description?: string
  }

  type UpdateCollection = Partial<CreateCollection> & {
    collectionId: string
  }

  type AddItemToFolder = {
    existingFolderId?: string
    newFolderName?: string
  }
}
