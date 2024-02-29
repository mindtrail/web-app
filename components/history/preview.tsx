type PreviewProps = {
  previewItem: HistoryItem
}

export const PreviewItem = ({ previewItem }: PreviewProps) => {
  console.log(previewItem)

  const renderIframe = () => {
    try {
      return (
        <iframe
          className='flex-1 w-full'
          loading='lazy'
          allowFullScreen={true}
          referrerPolicy='no-referrer-when-downgrade'
          src={previewItem?.name}
          title='YouTube video player'
        />
      )
    } catch (err) {
      console.log(err)
      return <div>Error</div>
    }
  }

  return (
    <div className='flex flex-col h-full p-4'>
      {previewItem?.title}

      {renderIframe()}
    </div>
  )
}
