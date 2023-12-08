import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { htmlToText } from 'html-to-text'
import { Document } from 'langchain/document'
import * as cheerio from 'cheerio'

import {
  formatChunkForEmbedding,
  ANCHORS_WITH_SIBINGS,
  HTML_TAGS_TO_EXCLUDE,
} from '@/lib/loaders/utils'

type HTMLResponse = {
  chunks: Document[]
  sumaryContent: string
}

export async function getChunksFromHTML(file: HTMLFile): Promise<HTMLResponse> {
  const { html, metadata, fileName } = file
  const { title = '', description = '' } = metadata

  const pageContent = cleanContent(html)

  const sumaryContent = `${title} \n
    ${description} \n ${pageContent.substring(0, 1000)}`

  if (!pageContent) {
    throw new Error('Page has not content to read')
  }

  const chunkTextSpliter = new RecursiveCharacterTextSplitter({
    chunkSize: 800, // characters
    chunkOverlap: 0,
    separators: ['\n\n'], // Split only on new paragraphs
  })

  const document = new Document({ pageContent })
  const chunkHeaderOptions = {
    chunkHeader: `${title}.`,
  }
  try {
    const chunks = (
      await chunkTextSpliter.splitDocuments([document], chunkHeaderOptions)
    ).map(({ pageContent, metadata }) => {
      return {
        metadata: {
          ...metadata,
          ...metadata,
          fileName,
        },
        pageContent: formatChunkForEmbedding(pageContent) || '',
      }
    })

    return {
      chunks,
      sumaryContent,
    }
  } catch (err) {
    console.error(err)
    throw new Error('Error splitting document')
  }
}

export const cleanContent = (html: string): string => {
  const $ = cheerio.load(html)

  $(HTML_TAGS_TO_EXCLUDE).remove()
  $(ANCHORS_WITH_SIBINGS).remove()
  $('a').removeAttr('href')
  $('img').removeAttr('src')

  const cleanedHTML = $('body').html() || ''

  return htmlToText(cleanedHTML)
}
