import { Document } from 'langchain/document'

import { cleanHTMLContent } from '@/lib/loaders/utils'

export async function getChunksFromHTML(
  file: HTMLFile,
): Promise<Document[] | Error> {
  const { html, fileName, metadata = {} } = file
  const { title = '', description = '' } = metadata

  const pageContent = cleanHTMLContent(html)

  // @TODO !!!!
  const sumaryContent = `${title} \n
    ${description} \n ${pageContent.substring(0, 1000)}`

  if (!pageContent) {
    throw new Error('Page has no content to read')
  }
  const loadedDoc = [new Document({ pageContent })]

  return loadedDoc
}
