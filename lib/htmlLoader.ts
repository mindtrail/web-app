import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { htmlToText } from 'html-to-text'
import { Document } from 'langchain/document'
import * as cheerio from 'cheerio'

const ANCHORS_WITH_SIBINGS = 'a:has(a)'
const ITEMS_TO_EXCLUDE =
  'nav, header, footer, aside, menu, menuitem, .nav, .header, .footer, .aside, .menu, .menuitem, .navigation, .navBar, .nav-bar, .navbar, .sidebar, .topnav, .bottomnav, .breadcrumb, .pagination, .dropdown, .pageFooter, .footer, .sidenav, .main-menu, .submenu, .widget, script, style, noscript, iframe, link[rel="alternate"]'

export async function getChunksFromHTML(file: HTMLFile): Promise<Document[]> {
  const { html, storageMetadata, fileName } = file
  const { pageTitle = '', metaDescription = '' } = storageMetadata

  const $ = cheerio.load(html)

  $(ITEMS_TO_EXCLUDE).remove()
  $(ANCHORS_WITH_SIBINGS).remove()
  $('a').removeAttr('href')
  $('img').removeAttr('src')

  const cleanedHTML = $('body').html() || ''
  const pageContent = htmlToText(cleanedHTML)

  if (!pageContent) {
    throw new Error('Page has not content to read')
  }

  const chunkTextSpliter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500, // = 2000/5 = 400 tokens
    chunkOverlap: 0,
    separators: ['\n\n'], // Split only on new paragraphs
  })

  const document = new Document({ pageContent })
  const chunkHeaderOptions = {
    chunkHeader: `${pageTitle}. ${metaDescription}. `,
  }
  try {
    const chunks = (
      await chunkTextSpliter.splitDocuments([document], chunkHeaderOptions)
    ).map(({ pageContent, metadata }) => {
      return {
        metadata: {
          ...metadata,
          ...storageMetadata,
          fileName,
        },
        pageContent: formatChunkForEmbedding(pageContent) || '',
      }
    })

    return chunks
  } catch (err) {
    console.error(err)
    throw new Error('Error splitting document')
  }
}

const formatChunkForEmbedding = (chunk: string): string => {
  return chunk
    .replace(/(?<!\n)\n(?!\n)/g, ' ') // Replace single newlines with spaces
    .replace(/\s?-\s?/g, '-') // Fix spacing around dashes
    .replace(/\.+/g, '.') // remove two consecutive periods
    .replace(/ \./g, '.') // Remove spaces before periods
    .replace(/\.(?=[a-zA-Z0-9])/g, '. ') // Ensure space after a period
    .replace(/[‘’]/g, "'") // Normalize curly quotes to straight quotes
    .replace(/[“”]/g, '"') // Normalize curly quotes to straight quotes
    .replace(/ ' /g, "'") // Remove extra spaces around single straight quotes
    .replace(/\s{2,}/g, ' ') // Replace multiple whitespace characters with a single space
    .toLowerCase() // Convert to lowercase
    .replace(
      /(?<=[\.!?]\s)([a-z])|^(?<start>[a-z])/g,
      (match, group1, start) => {
        if (group1) {
          return group1.toUpperCase()
        } else if (start) {
          return start.toUpperCase()
        }
        return match
      },
    ) // Capitalize first letter of each sentence
    .trim()
}
