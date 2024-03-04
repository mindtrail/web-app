import { useEffect, useState } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'

import { Button } from '@/components/ui/button'
// import { getWebsiteFromGCS, getWebsitePreview } from '@/lib/serverActions/dataSource'
import { getWebsitePreview } from '@/lib/api/preview'

type PreviewProps = {
  previewItem: HistoryItem
  setPreviewItem: (item: null) => void
}

export const PreviewItem = ({ previewItem, setPreviewItem }: PreviewProps) => {
  console.log(previewItem)
  const { type, name } = previewItem

  const [iframeURL, setIframeURL] = useState('')

  useEffect(() => {
    function onMessage(e: any) {
      if (e.data == 'preview-error') {
        console.log(55555, e)
      }
    }
    window.addEventListener('message', onMessage)

    async function getWebsite() {
      // const result = await getWebsiteFromGCS(previewItem)
      // console.log(result)
      // if (typeof result === 'string') {
      //   setIframeURL(result)
      // } else if (result?.error) {
      //   console.log(result.error)
      // }
      // const html = await getWebsitePreview(name)
      // console.log(html)
      // setIframeURL(html.text())
    }

    getWebsite()
    return () => window.removeEventListener('message', onMessage)
  }, [name])

  if (type === DataSourceType.file) {
    return <div className='flex flex-col h-full bg-muted'>File</div>
  }

  // if (!iframeURL) {
  //   return <div className='flex flex-col h-full bg-muted'>Loading...</div>
  // }

  return (
    <div className='flex flex-col h-full bg-muted'>
      <div className='flex justify-between items-center h-12 px-2 gap-4'>
        <Button onClick={() => setPreviewItem(null)} variant='ghost'>
          <Cross1Icon className='w-4 h-4' />
        </Button>
        {/* {previewItem?.title} */}
      </div>

      <iframe
        className='flex-1 w-full border'
        loading='lazy'
        allow='clipboard-write; encrypted-media; fullscreen'
        referrerPolicy='no-referrer-when-downgrade'
        src={name}
        title='YouTube video player'
        // onError={(msg) => console.log('111i  frame NOT loaded', msg)}
        // onLoad={(msg) => console.log('222 iframe loaded', msg)}
        // onErrorCapture={(msg) => console.log('333 iframe NOT loaded', msg)}
      />
    </div>
  )
}
