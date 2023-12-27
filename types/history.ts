import { DataSource } from '@prisma/client'
import {
  ColumnOrderState,
  SortingState,
  VisibilityState,
  TableState,
} from '@tanstack/react-table'

declare global {
  type HistoryItem = DataSource & {
    displayName: string
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
    tableState?: Partial<TableState>
    visibleColumns?: VisibilityState
    filters?: HistoryFilter[]
    sorting?: SortingState
    columnOrder?: ColumnOrderState
    columnSizes?: Record<string, number>
  }
}
