'use client'

import { useEffect, useState } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'
import { pdfjs } from 'react-pdf'
import { Document, Page } from 'react-pdf'

import { ExternalLink } from '@/components/external-link'
import { Button } from '@/components/ui/button'
import { canRenderInIFrame, getFileFromGCS } from '@/lib/serverActions/dataSource'

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString()
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type PreviewProps = {
  previewItem: HistoryItem
  setPreviewItem: (item: null) => void
}

export const PreviewItem = ({ previewItem, setPreviewItem }: PreviewProps) => {
  const { type, name, displayName } = previewItem

  const [iframeURL, setIframeURL] = useState(name)
  const [renderInIFrame, setRenderInIFrame] = useState(true)
  const [fileToRender, setFileToRender] = useState('')

  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  useEffect(() => {
    async function getWebsite() {
      try {
        const result = await canRenderInIFrame(name)
        setRenderInIFrame(result)
      } catch (error) {
        setRenderInIFrame(false)
        setIframeURL('')
      }
    }

    if (type === DataSourceType.web_page) {
      setRenderInIFrame(true)
      setIframeURL(name)
      getWebsite()
    }

    async function getFile() {
      // @ts-ignore
      const res = await getFileFromGCS(previewItem)

      if (typeof res === 'string') {
        setFileToRender(res)
        return
      }
    }

    if (type === DataSourceType.file) {
      getFile()
    }
  }, [name, type, previewItem])

  if (type === DataSourceType.file) {
    if (!fileToRender) {
      return
    }

    return (
      <div>
        <Document file={fileToRender} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    )
    // return <div className='flex flex-col h-full bg-muted'>File PDF</div>
  }

  return (
    <div className='flex flex-col h-full bg-muted'>
      <div className='flex justify-between items-center h-12 px-2 gap-4'>
        <Button onClick={() => setPreviewItem(null)} variant='ghost'>
          <Cross1Icon className='w-4 h-4' />
        </Button>
        {/* {previewItem?.title} */}
      </div>

      {renderInIFrame ? (
        <iframe
          className='flex-1 w-full border'
          loading='lazy'
          allow='clipboard-write; encrypted-media; fullscreen'
          referrerPolicy='no-referrer-when-downgrade'
          src={iframeURL}
          title='YouTube video player'
        />
      ) : (
        <div className='flex flex-col w-full flex-1 items-center justify-center gap-2'>
          <span className='cursor-default'>Cannot load in iFrame</span>
          <ExternalLink className='flex-initial' href={name}>
            {displayName}
          </ExternalLink>
        </div>
      )}
    </div>
  )
}
