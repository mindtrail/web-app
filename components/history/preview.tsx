'use client'

import { useEffect, useState } from 'react'
import { DataSourceType } from '@prisma/client'

import { ExternalLink } from '@/components/external-link'
import { canRenderInIFrame, getFileFromGCS } from '@/lib/serverActions/dataSource'

import { PDFViewer } from '@/components/history/pdf-viewer'

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

  return type === DataSourceType.file ? (
    <div className='flex-1 overflow-hidden'>
      <PDFViewer file={fileToRender} />
    </div>
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
  )
}
