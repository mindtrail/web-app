import { DataStore, AppDataSource } from '@prisma/client'
import { FileRejection } from 'react-dropzone'

declare type DataStoreExtended = DataStore & {
  dataSources: AppDataSource[]
}

declare type FileFilter = {
  validFiles: File[]
  rejectedFiles: FileRejection[]
}

declare type AcceptedFile = {
  file: File
  charCount?: number
}

declare type Metadata = {
  charCount: number
  name: string
  type: string
}
