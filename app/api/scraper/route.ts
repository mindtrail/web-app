import { getServerSession } from 'next-auth/next'
import { DataSrcType, DataSrcStatus } from '@prisma/client'
import fs from 'fs'

import { authOptions } from '@/lib/authOptions'
import { uploadToS3 } from '@/lib/s3'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSource'
import { getDocumentChunks } from '@/lib/fileLoader'
import { createAndStoreVectors } from '@/lib/qdrant'

const SCRAPER_URL = 'https://indies-scraper-jgnk6lxbhq-ey.a.run.app'
const SCRAPER_LIMIT = 10

// import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const url = new URL(req.url)
  const urlsToScrape = url.searchParams.get('urls')
  const dataStoreId = url.searchParams.get('dataStoreId')

  console.log(urlsToScrape, dataStoreId)

  const result = await fetch(
    `${SCRAPER_URL}?url=${urlsToScrape}&limit=${SCRAPER_LIMIT}`,
  )
  if (!result.ok) {
    return new Response('Failed to scrape', {
      status: 500,
    })
  }

  console.log('result', await result?.text())
  // const data = await result.json()

  // console.log('data', data)

  if (!urlsToScrape) {
    return new Response('No url provided', {
      status: 400,
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
