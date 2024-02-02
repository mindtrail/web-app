'use client'

import { useRouter } from 'next/navigation'
import { DataSourceStatus } from '@prisma/client'

import { Typography } from '@/components/typography'
import { useToast } from '@/components/ui/use-toast'

import { uploadFileApiCall } from '@/lib/api/dataSource'
import { scrapeURLs } from '@/lib/serverActions/dataSource'

import { ImportForm } from '@/components/import/form'
import { ImportFormValues } from '@/components/import/utils'

interface ImportDataSource extends React.ComponentProps<'div'> {
  userId: string
}

export function ImportDataSource({ userId }: ImportDataSource) {
  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (data: ImportFormValues) => {
    try {
      await processImportData(data)
      router.push('/history?refresh=true')
    } catch (err) {
      console.log(err)

      toast({
        title: 'Error',
        variant: 'destructive',
        description: `${err}. Please try again!`,
      })
    }
  }

  const onScrapeWebsite = async (url: string) => {
    const res = await fetch(`/api/scraper?urls=${url}`)
    const data = await res.json()
    console.log(data)
  }

  const processImportData = async (data: ImportFormValues) => {
    const { files, newURL } = data

    // Only upload files that are not synched and have content
    const unsynchedFiles = files?.filter(
      ({ status, textSize }) => status === DataSourceStatus.unsynched && textSize > 0,
    )

    if (newURL) {
      // @TODO: If I will add https:// automatically, it should be done here
      const urlList = newURL.split(',').map((url) => url.trim())
      const scrapeResult = await scrapeURLs(urlList)

      if (scrapeResult?.error) {
        throw new Error(scrapeResult?.error?.message)
      }

      toast({
        title: 'URL import started',
        description: `Websites are being imported. It may take a minute or two.`,
      })
    }

    // We only upload files if there are changes
    if (unsynchedFiles?.length) {
      const { failedUpload, successUpload } = await uploadFiles(unsynchedFiles)

      const successMessage = successUpload?.length
        ? `Files uploaded: ${successUpload.join(', ')}.`
        : ''
      const failedMessage = failedUpload?.length
        ? `Failed to upload: ${failedUpload.join(', ')}!`
        : ''
      const toastTitle = failedMessage?.length
        ? 'Partial import started!'
        : 'Import started'

      return toast({
        title: toastTitle,
        description: `${failedMessage} ${successMessage}`,
      })
    }
  }

  const uploadFiles = async (files: AcceptedFile[]) => {
    const successUpload: string[] = []
    const failedUpload: string[] = []
    const res = await Promise.all(
      files.map(async ({ file }) => {
        try {
          await uploadFileApiCall(file as File)
          successUpload.push(file.name)
        } catch (err) {
          console.log(err)
          failedUpload.push(file.name)
        }
      }),
    )
    console.log('failedUpload', failedUpload, res)
    return { failedUpload, successUpload }
  }

  return (
    <div className='flex flex-col flex-1 w-full px-6 py-4 md:py-8 md:px-8 gap-4'>
      <Typography variant='h4' className='mb-4 text-gray-700'>
        Import Data
      </Typography>
      <div className='max-w-xl w-full'>
        <ImportForm
          onSubmit={onSubmit}
          // existingCollection={existingCollection}
          onScrapeWebsite={onScrapeWebsite}
        />
      </div>
    </div>
  )
}
