import { DataStore, AppDataSource } from '@prisma/client'
import { FileRejection } from 'react-dropzone'

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

export type FileFilter = {
  validFiles: File[]
  rejectedFiles: FileRejection[]
}

export type AcceptedFile = {
  file: File
  charCount?: number
}

export type Metadata = {
  charCount: number
  name: string
  type: string
}

export const filterFilesBySize = (files: File[]) => {
  return files.reduce(
    (acc, file: File) => {
      if (file.size <= MAX_FILE_SIZE) {
        acc.validFiles.push(file)
      } else {
        const fileRejection: FileRejection = {
          file,
          errors: [
            {
              code: 'size',
              message: `File ${file.name} is too large`,
            },
          ],
        }
        acc.rejectedFiles.push(fileRejection)
      }
      return acc
    },
    { validFiles: [], rejectedFiles: [] } as FileFilter,
  )
}

export function getFileRejectionsMaxFiles(excessFiles: File[]) {
  return excessFiles.map(
    (file) =>
      ({
        file,
        errors: [
          {
            code: 'max-nr',
            message: `File ${file.name} is above the max files threshold`,
          },
        ],
      } as FileRejection),
  )
}

export async function getFilesMetadata(files: File[]) {
  const promises = files.map((file) => {
    const formData = new FormData()
    formData.append('file', file)

    return fetch(METADATA_ENDPOINT, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata for file ${file.name}`)
      }
      return response.json()
    })
  })

  const filesMetadata = await Promise.all(promises)
  return filesMetadata
}

export const updateFilesWithMetadata = (prevFiles: AcceptedFile[], filesMetadata: Metadata[]) => {
  const filesMetadataMap: { [key: string]: Metadata } = {}
  filesMetadata.forEach((metadata) => {
    filesMetadataMap[metadata.name] = metadata
  })

  // @TODO - map
  const newFiles = prevFiles.map((item) => {
    const { file } = item
    const { name, type } = file

    const metadata = filesMetadataMap[name]
    console.log(metadata, type, metadata?.type)
    // For md files or other text files, we don't have a type but in the BE I get octet-stream
    if (metadata && (!type || type === metadata.type)) {
      return {
        ...item,
        charCount: metadata.charCount,
      }
    }

    return item
  })
  console.log(newFiles)
  return newFiles
}

export type DataStoreExtended = DataStore & {
  dataSources: AppDataSource[]
}
