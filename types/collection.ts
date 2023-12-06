import { Collection, DataSource, DataSourceStatus } from '@prisma/client'

declare global {
  type CollectionExtended = Collection & {
    dataSources: DataSource[]
  }

  type AcceptedFile = {
    file: File | DataSource
    source?: 'local' | 'remote'
    status?: DataSourceStatus
    charCount?: number
  }

  type URLScrapped = {
    file: DataSource
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

  type CreateCollection = {
    userId: string
    name: string
    description: string
  }

  type UpdateCollection = Partial<CreateCollection> & {
    collectionId: string
  }

  type DeleteHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    file: AcceptedFile | URLScrapped,
  ) => void
}
