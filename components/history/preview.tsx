'use client'

import { useEffect, useState } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'

import { ExternalLink } from '@/components/external-link'
import { Button } from '@/components/ui/button'
import { canRenderInIFrame, getFileFromGCS } from '@/lib/serverActions/dataSource'

import { PDFViewer } from './pdf-viewer'

type PreviewProps = {
  previewItem: HistoryItem
  setPreviewItem: (item: null) => void
}

export const PreviewItem = ({ previewItem, setPreviewItem }: PreviewProps) => {
  const { type, name, displayName } = previewItem

  const [iframeURL, setIframeURL] = useState(name)
  const [renderInIFrame, setRenderInIFrame] = useState(true)
  const [fileToRender, setFileToRender] = useState('')

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

  return (
    <div className='flex flex-col h-full bg-muted'>
      <div className='flex justify-between items-center h-12 px-2 gap-4'>
        <Button onClick={() => setPreviewItem(null)} variant='ghost'>
          <Cross1Icon className='w-4 h-4' />
        </Button>
        {/* {previewItem?.title} */}
      </div>

      {type === DataSourceType.file ? (
        <PDFViewer file={fileToRender} />
      ) : renderInIFrame ? (
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
