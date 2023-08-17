import { DataStore, AppDataSource, DataSourceStatus } from '@prisma/client'

declare global {
  type DataStoreExtended = DataStore & {
    dataSources: AppDataSource[]
  }

  type AcceptedFile = {
    file: File
    source?: 'local' | 'remote'
    status?: DataSourceStatus
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
}
