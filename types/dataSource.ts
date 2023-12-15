import { DataSource, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

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

  type WEB_Data = {
    title: string
    description: string
    image?: string
    url: string
  }

  type ScrapingFile = {
    uri: string
    metadata: WEB_Data
  }

  type ScrapingResult = {
    userId: string
    collectionId?: string
    websites: ScrapingFile[]
  }

  type BrowserExtensionData = WEB_Data & {
    autoSave?: boolean
    html: string
  }

  interface HTMLFile {
    uri: string
    html: string
    metadata: Partial<BrowserExtensionData>
  }

  type HTMLChunkingResponse = {
    chunks: Document[]
    sumaryContent?: string
  }

  type FileChunkingResponse = {
    chunks: Document[]
  }
}
