import { DataStore, DataSrc, DataSrcStatus } from '@prisma/client'

declare global {
  type DataStoreExtended = DataStore & {
    dataSrcs: DataSrc[]
  }

  type AcceptedFile = {
    file: File | DataSrc
    source?: 'local' | 'remote'
    status?: DataSrcStatus
    charCount?: number
  }

  type RejectedFile = {
    file: File
    error: 'size' | 'limit'
  }

  type FileFilter = {
    acceptedFiles: AcceptedFile[]
    rejectedFiles: RejectedFile[]
  }

  type Metadata = {
    charCount: number
    name: string
    type: string
  }

  type CreateDataStore = {
    userId: string
    name: string
    description: string
  }

  type UpdateDataStore = Partial<CreateDataStore> & {
    dataStoreId: string
  }
}
