import { getServerSession } from 'next-auth/next'
import { DataSrcType, DataSrcStatus } from '@prisma/client'
import fs from 'fs'

import { authOptions } from '@/lib/authOptions'
import { uploadToS3 } from '@/lib/s3'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSource'
import { getDocumentChunks } from '@/lib/fileLoader'
import { createAndStoreVectors } from '@/lib/qdrant'
import { PuppeteerCrawler } from 'crawlee'
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const url = new URL(req.url)

  const urlToScrape = url.searchParams.get('url')

  if (!urlToScrape) {
    return new Response('No url provided', {
      status: 400,
    })
  }

  console.log('GET', urlToScrape)

  const loader = new PuppeteerWebBaseLoader(urlToScrape, {
    launchOptions: {
      headless: 'new',
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
    },
  })

  const docs = await loader.load()

  console.log(docs[0]?.pageContent?.length)

  // Write to a temporaty file in the fs
  // const tempFileName = `temp-web-scrapper-simple.txt`
  // const tempFilePath = `tmp/${tempFileName}`
  // fs.writeFileSync(tempFilePath, docs[0].pageContent)

  return new Response(docs[0].pageContent, {
    status: 200,
  })
}
