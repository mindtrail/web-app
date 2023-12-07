import { DataSource, DataSourceStatus } from '@prisma/client'

declare global {
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

  type DeleteHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    file: AcceptedFile | URLScrapped,
  ) => void

  type ScrapingFile = {
    fileName: string
    metadata: {
      content: string
      title: string
      description: string
      image: string
      url: string
    }
  }

  type ScrapingResult = {
    bucket: string
    userId: string
    collectionId?: string
    files: ScrapingFile[]
  }
}
