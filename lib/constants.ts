export const MAX_NR_OF_FILES = 20
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 10 MB
export const MAX_CHARS_PER_KB = 500 * 1000 * 1000 //

export const FIXED_COLUMNS = ['displayName']
export const DRAG_ITEM_TYPE = 'column'

export const DEFAULT_USER_PREFS = [
  {
    id: 'displayName',
    accessorKey: 'displayName',
    size: 300,
    enableHiding: false,
    minSize: 100,
    maxSize: 400,
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 300,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    size: 150,
  },
  {
    id: 'dataSourceTags',
    accessorKey: 'dataSourceTags',
    size: 300,
  },
]
