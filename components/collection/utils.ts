import * as z from 'zod'
import { DataSourceStatus, DataSourceType } from '@prisma/client'

import { formatDate } from '@/lib/utils'
import { MAX_FILE_SIZE } from '@/components/collection/constants'

export type CollectionFormValues = z.infer<typeof collectionFormSchema>

export const getFormInitialValues = (
  collection?: CollectionExtended,
): CollectionFormValues => {
  if (collection) {
    return {
      name: collection.name,
      description: collection.description || '',
      files: collection.dataSources
        ? collection.dataSources
            .filter((file) => file.type === DataSourceType.file)
            .map((file) => ({
              file,
              source: 'remote',
              status: file.status,
              textSize: file.textSize,
            }))
        : [],
      urls: collection.dataSources
        ? collection.dataSources
            .filter((file) => file.type === DataSourceType.web_page)
            .map((url) => ({
              file: url,
              source: 'remote',
              status: url.status,
              textSize: url.textSize,
            }))
        : [],
      newURL: '',
    }
  }

  return {
    name: `KB - ${formatDate(new Date())}`,
    description: '',
    files: [],
    urls: [],
    newURL: '',
  }
}

export const collectionFormSchema = z
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
    newURL: z
      .string()
      .refine((url) => validateUrls(url), {
        message: 'Please enter a valid URL. Eg: https://www.example.com',
      })
      .optional(),
  })
  .refine(
    (data) => {
      return Boolean(data.files?.length) || Boolean(data.newURL)
    },
    {
      message: 'You must add either a File or a Website.',
      path: ['filesOrUrls'],
    },
  )

export const filterFiles = (files: File[], remainingSlots: number) => {
  let count = 0
  const acceptedFiles: AcceptedFile[] = []
  const rejectedFiles: RejectedFile[] = []

  files.forEach((file) => {
    if (file.size <= MAX_FILE_SIZE && count < remainingSlots) {
      acceptedFiles.push({
        file,
        status: DataSourceStatus.unsynched,
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

  // @TODO - map
  const newFiles = prevFiles.map((item) => {
    const { file } = item
    const { name, type } = file

    const metadata = filesMetadataMap[name]
    // For md files or other text files, we don't have a type but in the BE I get octet-stream
    if (metadata && (!type || type === metadata.type)) {
      return {
        ...item,
        textSize: metadata.textSize,
      }
    }

    return item
  })

  return newFiles
}

function validateUrls(urls: string = '') {
  if (!urls) {
    return true
  }

  const urlList = urls.split(',').map((url) => url.trim())

  // Check each URL string to see if it's valid
  for (let urlString of urlList) {
    try {
      new URL(urlString)
    } catch (e) {
      // If any URL string is invalid, return false
      return false
    }
  }

  // If all URL strings are valid, return true
  return true
}
