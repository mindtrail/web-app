import { DataStore, AppDataSource } from '@prisma/client'
import { FileRejection } from 'react-dropzone'

declare global {
  type DataStoreExtended = DataStore & {
    dataSources: AppDataSource[]
  }

  type FileFilter = {
    validFiles: File[]
    rejectedFiles: FileRejection[]
  }

  type AcceptedFile = {
    file: File
    charCount?: number
  }

  type Metadata = {
    charCount: number
    name: string
    type: string
  }

  type RejectedFile = FileRejection
}
