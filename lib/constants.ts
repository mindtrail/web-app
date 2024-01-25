export const MAX_NR_OF_FILES = 20
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 10 MB
export const MAX_CHARS_PER_KB = 500 * 1000 * 1000 //

export const MIN_SIZE = 130
export const MAX_SIZE = 600

export const FIXED_COLUMNS = ['displayName']
export const DRAG_ITEM_TYPE = 'column'

export const DEFAULT_COLUMN_ORDER = [
  'displayName',
  'description',
  'createdAt',
  'dataSourceTags',
]

export const COLUMN_LABELS: Record<string, string> = {
  displayName: 'Item',
  description: 'Description',
  createdAt: 'Created',
  dataSourceTags: 'Tags',
}

export const DEFAULT_COLUMN_VISIBILITY = {
  displayName: true,
  description: true,
  createdAt: true,
  dataSourceTags: true,
}

export const DEFAULT_COLUMN_SIZE = {
  displayName: 200,
  description: 300,
  createdAt: 150,
  dataSourceTags: 200,
}

export const SELECTED_ITEM = {
  FILTERS: 0,
  COLLECTIONS: 1,
  TAGS: 2,
  HIGHLIHTS: 3,
}