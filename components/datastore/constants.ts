export const ACCEPTED_FILE_TYPES = [
  'application/epub+zip',
  'application/json',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/x-ndjson',
  'application/x-subrip',
  'application/octet-stream',
  'text/csv',
  'text/plain',
  'text/markdown',
]

export const ACCEPTED_FILE_REACT_DROPZONE = {
  'application/json': ['.json', '.jsonl'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/x-ndjson': ['.jsonl'],
  'application/x-subrip': ['.srt'],
  // 'application/octet-stream': ['', ''],
  'text/csv': ['.csv'],
  'text/plain': ['.txt', '.text', '.log'],
  'text/markdown': ['.md'],
}

export const DATASTORE_ENDPOINT = '/api/datastore'
export const UPLOAD_ENDPOINT = '/api/upload'
export const METADATA_ENDPOINT = '/api/upload/metadata'

export const MAX_NR_OF_FILES = 10
export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const MAX_CHARS_PER_KB = 5 * 1000 * 1000
export const UPLOAD_LABEL =
  'Drag and drop files or <span class="filepond--label-action">Browse</span>'

export const DROPZONE_STYLES = {
  DEFAULT: 'border-neutral-300 bg-neutral-50',
  REJECT: 'border-red-400 bg-neutral-300 cursor-not-allowed text-neutral-800',
  ACCEPT: 'border-green-600 bg-green-50',
}
