export const MAX_NR_OF_FILES = 20
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 10 MB
export const MAX_CHARS_PER_KB = 500 * 1000 * 1000 //

export const MIN_COL_SIZE = 130
export const MAX_COL_SIZE = 600

export const FIXED_COLUMNS = ['displayName']
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
  // description: 'Description',
  // createdAt: 'Created',
  // dataSourceTags: 'Tags',
}

export const DATA_TYPE = {
  DEFAULT: 'default',
  HIGHLIGHTS: 'highlights',
}

export const TABLE_LABELS = {
  [DATA_TYPE.DEFAULT]: DEFAULT_COL_LABELS,
  [DATA_TYPE.HIGHLIGHTS]: HIGHLIGHTS_LABELS,
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
  createdAt: MIN_COL_SIZE,
  dataSourceTags: 200,
}
