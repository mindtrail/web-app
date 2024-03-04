import { useEffect, useState } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'
import Link from 'next/link'
import { ExternalLink } from '@/components/external-link'

import { Button } from '@/components/ui/button'
import { canRenderInIFrame } from '@/lib/serverActions/dataSource'

type PreviewProps = {
  previewItem: HistoryItem
  setPreviewItem: (item: null) => void
}

export const PreviewItem = ({ previewItem, setPreviewItem }: PreviewProps) => {
  const { type, name, displayName } = previewItem

  const [iframeURL, setIframeURL] = useState(name)
  const [renderInIFrame, setRenderInIFrame] = useState(true)

  useEffect(() => {
    async function getWebsite() {
      try {
        const result = await canRenderInIFrame(name)
        setRenderInIFrame(result)
        setIframeURL(name)
        console.log(result)
      } catch (error) {
        setRenderInIFrame(false)
        setIframeURL('')
        console.error(error)
      }
    }

    getWebsite()
  }, [name])

  if (type === DataSourceType.file) {
    return <div className='flex flex-col h-full bg-muted'>File</div>
  }

  console.log(type, iframeURL)

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
          // onError={(msg) => console.log('111i  frame NOT loaded', msg)}
          // onLoad={(msg) => console.log('222 iframe loaded', msg)}
          // onErrorCapture={(msg) => console.log('333 iframe NOT loaded', msg)}
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
