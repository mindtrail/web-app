import { useEffect } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

type PreviewProps = {
  previewItem: HistoryItem
  setPreviewItem: (item: null) => void
}

export const PreviewItem = ({ previewItem, setPreviewItem }: PreviewProps) => {
  useEffect(() => {
    function onMessage(e: any) {
      if (e.data == 'preview-error') {
        console.log(e)
      }
    }
    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div className='flex flex-col h-full bg-muted'>
      <div className='flex justify-between items-center p-2 gap-4'>
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
        src={previewItem?.name}
        title='YouTube video player'
        onError={(msg) => console.log('iframe NOT loaded', msg)}
      />
    </div>
  )
}
