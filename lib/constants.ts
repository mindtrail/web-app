export const MAX_NR_OF_FILES = 20
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 10 MB
export const MAX_CHARS_PER_KB = 500 * 1000 * 1000 //

export const MIN_COL_SIZE = 130
export const MAX_COL_SIZE = 800

export const FIXED_COLUMNS = ['displayName', 'highlights']
export const DRAG_ITEM_TYPE = 'column'

export const DEFAULT_COLUMN_ORDER = [
  'displayName',
  'description',
  'createdAt',
  'dataSourceTags',
]

export const DEFAULT_COL_LABELS: Record<string, string> = {
  displayName: 'Item',
  description: 'Description',
  createdAt: 'Created',
  dataSourceTags: 'Tags',
}

export const HIGHLIGHTS_LABELS: Record<string, string> = {
  displayName: 'Highlight',
}

export const ENTITY_TYPE = {
  COLLECTION: 'collection',
  TAG: 'tag',
  HIGHLIGHTS: 'highlights',
  ALL_ITEMS: 'all-items',
}

export const getTableHeaders = (entityType?: string) =>
  entityType === ENTITY_TYPE.HIGHLIGHTS ? HIGHLIGHTS_LABELS : DEFAULT_COL_LABELS

export const DEFAULT_COLUMN_VISIBILITY = {
  displayName: true,
  description: true,
  createdAt: true,
  dataSourceTags: true,
}

export const DEFAULT_COLUMN_SIZE = {
  displayName: 200,
  description: 300,
  createdAt: MIN_COL_SIZE,
  dataSourceTags: 200,
}
