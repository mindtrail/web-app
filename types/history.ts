import {
  Clipping,
  DataSource,
  DataSourceTag,
  Tag,
  Collection,
  CollectionDataSource,
} from '@prisma/client'

declare global {
  type HistoryItem = DataSource & {
    displayName: string
    clippings?: Clipping[]
    dataSourceTags?: (DataSourceTag & { tag: Tag })[]
    collectionDataSource?: (CollectionDataSource & { collection: Collection })[]
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
