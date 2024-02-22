import { Clipping, DataSource } from '@prisma/client'

declare global {
  type HistoryItem = DataSource & {
    displayName: string
    clippings: Clipping[]
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

  type UserTablePrefs = {
    // visibleColumns?: VisibilityState
    // filters?: HistoryFilter[]
    // sorting?: SortingState
    columnVisibility?: Record<string, boolean>
    columnOrder?: string[]
    columnSize?: Record<string, number>
  }
}
