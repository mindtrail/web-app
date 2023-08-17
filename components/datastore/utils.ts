import { MAX_FILE_SIZE } from '@/components/datastore/constants'

export const filterFilesBySize = (files: File[]) => {
  return files.reduce(
    (acc, file: File) => {
      if (file.size <= MAX_FILE_SIZE) {
        acc.validFiles.push(file)
      } else {
        const fileRejection: RejectedFile = {
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

export function getFilesOverLimit(excessFiles: File[]) {
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
      } as RejectedFile),
  )
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
