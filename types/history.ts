import { DataSource } from '@prisma/client'

declare global {
  type HistoryItem = DataSource & {
    displayName: string
  }

  type HistoryViewProps = {
    userId: string
    historyItems: HistoryItem[]
    // serverCall: () => void
  }

  type HistoryFilter = {
    label: string
    value: string
  }

  type ColumnSize = {
    column: string
    size: number
    minSize?: number
    maxSize?: number
  }

  type UserPreferences = {
    visibleColumns: string[]
    filters?: HistoryFilter[]
    sorting?: string
    columnOrder?: string[]
    columnSizes?: ColumnSize[]
  }
}
