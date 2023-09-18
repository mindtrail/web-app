import { getServerSession } from 'next-auth/next'
import { DataSrcType, DataSrcStatus } from '@prisma/client'
import fs from 'fs'

import { authOptions } from '@/lib/authOptions'
import { uploadToS3 } from '@/lib/s3'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSource'
import { getDocumentChunks } from '@/lib/fileLoader'
import { createAndStoreVectors } from '@/lib/qdrant'

const env = process.env.NODE_ENV

const SCRAPER_URL =
  env === 'development'
    ? 'http://localhost:80' // Local scraper
    : 'https://indies-scraper-jgnk6lxbhq-ey.a.run.app' // deployed scraper
const SCRAPER_LIMIT = 10

const FETCH_LINKS_URL = SCRAPER_URL + '/links'

// import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const reqUrl = new URL(req.url)

  const urls = reqUrl.searchParams.get('urls')
  const dataStoreId = reqUrl.searchParams.get('dataStoreId')
  const prefetchUrls = reqUrl.searchParams.get('prefetchUrls')

  if (prefetchUrls) {
    try {
      const result = await fetch(`${FETCH_LINKS_URL}?url=${prefetchUrls}`)
      if (!result.ok) {
        return new Response('Failed to fetch links', {
          status: 500,
        })
      }
    } catch (e) {
      console.log('error', e)
      return new Response('Failed to fetch links', {
        status: 500,
      })
    }
  }

  console.log(urls, dataStoreId)

  try {
    const result = await fetch(
      `${SCRAPER_URL}?url=${urls}&limit=${SCRAPER_LIMIT}&dataStoreId=${dataStoreId}`,
    )
    if (!result.ok) {
      return new Response('Failed to scrape', {
        status: 500,
      })
    }

    console.log('result', await result?.json())
    // const data = await result.json()

    // console.log('data', data)

    if (!url) {
      return new Response('No url provided', {
        status: 400,
      })
    }
  } catch (e) {
    console.log('error', e)
    return new Response('Failed to scrape', {
      status: 500,
    })
  }

  // const result = await getCrawlResult(urlToScrape)
  // console.log('---- - ----', result)

  // const loader = new PuppeteerWebBaseLoader(urlToScrape, {
  //   launchOptions: {
  //     headless: 'new',
  //   },
  //   gotoOptions: {
  //     waitUntil: 'domcontentloaded',
  //   },
  // })

  // const docs = await loader.load()

  // console.log(docs[0]?.pageContent?.length)

  // Write to a temporaty file in the fs
  // const tempFileName = `scrapped-2.txt`
  // const tempFilePath = `tmp/${tempFileName}`
  // const res = docs[0]?.pageContent
  // const res = 'hello world'
  // fs.writeFileSync(tempFilePath, res)

  return new Response('ok', {
    status: 200,
  })
}
