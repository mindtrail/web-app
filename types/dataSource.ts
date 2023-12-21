import { DataSource, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

declare global {
  type AcceptedFile = {
    file: File | DataSource
    source?: 'local' | 'remote'
    status?: DataSourceStatus
    textSize?: number
  }

  type URLScrapped = {
    file: DataSource
    source?: 'local' | 'remote'
    status?: DataSourceStatus
    textSize?: number
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
    textSize: number
    name: string
    type: string
  }

  type DeleteHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    file: AcceptedFile | URLScrapped,
  ) => void

  type ScrapingResult = {
    userId: string
    collectionId?: string
    websites: ScrapingFile[]
  }

  type WEB_Data = {
    title: string
    description: string
    image?: string
    url: string
    tags?: string[]
  }

  type ScrapingFile = {
    name: string
    metadata: WEB_Data
  }

  type BrowserExtensionData = WEB_Data & {
    autoSave?: boolean
    html: string
  }

  interface HTMLFile {
    name: string
    html: string
    metadata: Partial<BrowserExtensionData>
  }
}
