import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'
import { DataSourceType } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getNanoId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10,
) // 10

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const getURLDisplayName = (urlString: string): string => {
  try {
    const url = new URL(urlString)
    let hostname = url?.hostname?.startsWith('www.')
      ? url.hostname.slice(4)
      : url.hostname

    return hostname
  } catch (e) {
    console.error(e)
    return urlString
  }
}

export const getURLPathname = (urlString: string): string => {
  try {
    const url = new URL(urlString)
    return url.pathname
  } catch (e) {
    console.error(e)
    return urlString
  }
}

export const addHttpsIfMissing = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}

type LoaderProps = {
  src: string
  width: number
  quality?: number
}

export const cloudinaryLoader = ({ src, width = 200, quality = 75 }: LoaderProps) => {
  const cloudinaryBase = 'https://res.cloudinary.com/dea7r24ca/image/fetch/'
  return `${cloudinaryBase}w_${width},q_${quality || 75}/${src}`
}

export const readFormData = async (req: Request) => {
  const formData = await req.formData()
  let file: File | null = null
  let collectionId = ''

  for (const value of Array.from(formData.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    if (typeof value == 'object') {
      file = value
    }
    // If its type is string then it's the collectionId
    if (typeof value == 'string') {
      collectionId = value
    }
  }

  return { file, collectionId }
}

export enum GCS_ACTION_TYPE {
  UPLOAD = 'upload',
  DELETE = 'delete',
  DOWNLOAD = 'download',
}

type BuildPath = {
  userId: string
  dataSourceId: string
  name: string
  DSType: DataSourceType
}

export function buildGCSFilePath({ userId, dataSourceId, name, DSType }: BuildPath) {
  if (DSType === DataSourceType.file) {
    return `${userId}/files/${name}/${dataSourceId}`
  }

  const builtPath = getGCSPathFromURL(name)
  return `${userId}/websites/${builtPath}`
}

function getGCSPathFromURL(url: string) {
  const urlObj = new URL(url)
  const { hostname } = urlObj

  let pathname = urlObj.pathname.substring(1).replace(/\s+|\//g, '-') || 'index'
  pathname = pathname.endsWith('-') ? pathname.slice(0, -1) : pathname

  return `${hostname}/${pathname}`
}
