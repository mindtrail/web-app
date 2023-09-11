import { getServerSession } from 'next-auth/next'
import { DataSrcType, DataSrcStatus } from '@prisma/client'
import fs from 'fs'

import { authOptions } from '@/lib/authOptions'
import { uploadToS3 } from '@/lib/s3'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSource'
import { getDocumentChunks } from '@/lib/fileLoader'
import { createAndStoreVectors } from '@/lib/qdrant'

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

  console.log(dataStoreId, urlsToScrape)

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
  const tempFileName = `scrapped-2.txt`
  const tempFilePath = `tmp/${tempFileName}`
  // const res = docs[0]?.pageContent
  const res = 'hello world'
  // fs.writeFileSync(tempFilePath, res)

  return new Response(res, {
    status: 200,
  })
}
