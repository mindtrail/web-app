import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'

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

export const getHostName = (urlString: string) => {
  try {
    const url = new URL(
      urlString.includes('://') ? urlString : 'https://' + urlString,
    )
    return url.hostname
  } catch (e) {
    console.error(e)
    return urlString
  }
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

export const cloudinaryLoader = ({
  src,
  width = 200,
  quality = 75,
}: LoaderProps) => {
  const cloudinaryBase = 'https://res.cloudinary.com/dea7r24ca/image/fetch/'
  return `${cloudinaryBase}w_${width},q_${quality || 75}/${src}`
}
