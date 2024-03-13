import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

import { getDataSourceById } from '@/lib/db/dataSource'

async function getOGImage(website: string) {
  try {
    const res = await fetchWithTimeout(website)
    const html = await res.text()

    const $ = cheerio.load(html)
    const image = $('meta[property="og:image"]').attr('content')

    return image
  } catch (err) {
    return ''
  }
}

async function fetchWithTimeout(url: string) {
  const timeout = 1500

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(url, {
    signal: controller.signal,
  })
  clearTimeout(id)

  return response
}
