import * as z from 'zod'
import { DataSrcStatus, DataSrcType } from '@prisma/client'

import { formatDate } from '@/lib/utils'
import { MAX_FILE_SIZE } from '@/components/datastore/constants'

export const getFormInitialValues = (
  dataStore?: DataStoreExtended,
): DataStoreFormValues => {
  if (dataStore) {
    return {
      name: dataStore.name,
      description: dataStore.description || '',
      files: dataStore.dataSrcs
        .filter((file) => file.type === DataSrcType.file)
        .map((file) => ({
          file,
          source: 'remote',
          status: file.status,
          charCount: file.textSize,
        })),
      urls: dataStore.dataSrcs
        .filter((file) => file.type === DataSrcType.web_page)
        .map((url) => ({
          url,
          source: 'remote',
          status: url.status,
          charCount: url.textSize,
        })),
    }
  }

  return {
    name: `KB - ${formatDate(new Date())}`,
    description: '',
    files: [],
    urls: [],
  }
}

// const fileSchema = z.object({
//   file: z.object({
//     name: z.string(),
//     type: z.string(),
//     // ... other file properties
//   }),
//   status: z.enum([DataSrcStatus.unsynched, /* ... other statuses */]),
//   // ... other file properties
// });

// const urlSchema = z.object({
//   url: z.object({
//     name: z.string(),
//     // ... other url properties
//   }),
//   status: z.enum([DataSrcStatus.unsynched /* ... other statuses */]),
//   // ... other url properties
// })

const newURLSchema = z.string().refine(validateUrls, {
  message:
    'Invalid URLs. If entering multiple URLs, separate them with commas.',
})

export const dataStoreFormSchema = z
  .object({
    name: z
      .string()
      .min(4, {
        message: 'Name must be at least 5 characters.',
      })
      .max(40, {
        message: 'Name must not be longer than 40 characters.',
      }),
    description: z
      .string()
      .min(4, {
        message: 'Description must be at least 5 characters.',
      })
      .max(100, {
        message: 'Description must not be longer than 100 characters.',
      }),
    files: z.array(z.any()).optional(),
    urls: z.array(z.any()).optional(),
    newURL: newURLSchema.optional(), // Add the newURL field here and make it optional
  })
  .refine(
    (data) => {
      return Boolean(data.files?.length) || Boolean(data.urls?.length)
    },
    {
      message: 'You must add either files or urls.',
    },
  )

export type DataStoreFormValues = z.infer<typeof dataStoreFormSchema>

export const filterFiles = (files: File[], remainingSlots: number) => {
  let count = 0
  const acceptedFiles: AcceptedFile[] = []
  const rejectedFiles: RejectedFile[] = []

  files.forEach((file) => {
    if (file.size <= MAX_FILE_SIZE && count < remainingSlots) {
      acceptedFiles.push({
        file,
        status: DataSrcStatus.unsynched,
      })
      count++
    } else {
      rejectedFiles.push({
        file,
        error: file.size >= MAX_FILE_SIZE ? 'size' : 'limit',
      })
    }
  })

  return { acceptedFiles, rejectedFiles }
}

export const updateFilesWithMetadata = (
  prevFiles: AcceptedFile[],
  filesMetadata: Metadata[],
) => {
  const filesMetadataMap: { [key: string]: Metadata } = {}
  filesMetadata.forEach((metadata) => {
    filesMetadataMap[metadata.name] = metadata
  })
  console.log('filesMetadataMap', filesMetadataMap)

  // @TODO - map
  const newFiles = prevFiles.map((item) => {
    const { file } = item
    const { name, type } = file

    const metadata = filesMetadataMap[name]
    // For md files or other text files, we don't have a type but in the BE I get octet-stream
    if (metadata && (!type || type === metadata.type)) {
      return {
        ...item,
        charCount: metadata.charCount,
      }
    }

    return item
  })

  return newFiles
}

function validateUrls(value: string) {
  const urlPattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  const urls = value.split(',')
  for (let url of urls) {
    url = url.trim()
    if (!urlPattern.test(url)) {
      return false // Invalid URL found
    }
  }
  return true // All URLs are valid
}
