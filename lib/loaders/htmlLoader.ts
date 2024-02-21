import { Document } from 'langchain/document'

import { cleanHTMLContent } from '@/lib/loaders/utils'

export async function getChunksFromHTML(file: HTMLFile): Promise<Document[]> {
  const { html } = file
  const pageContent = cleanHTMLContent(html)

  if (!pageContent) {
    throw new Error('Empty page. No content to read')
  }

  const loadedDoc = [new Document({ pageContent })]
  return loadedDoc
}
