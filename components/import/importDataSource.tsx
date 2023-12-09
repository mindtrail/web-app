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
    // TODO: Add dropdown to select collection
    const { files, urls, newURL } = data

    const unsynchedFiles = files?.filter(
      ({ status }) => status === DataSourceStatus.unsynched,
    )

    if (newURL) {
      // @TODO: If I will add https:// automatically, it should be done here
      const urlList = newURL.split(',').map((url) => url.trim())
      const scrapeResult = await scrapeURLs(urlList)

      if (scrapeResult?.error) {
        throw new Error(scrapeResult?.error?.message)
      }
    }

    // We only upload files if there are changes
    if (unsynchedFiles?.length) {
      await uploadFiles(unsynchedFiles)
    }

    toast({
      title: 'Data import started',
      description: `Import started. Data will be updated a few moments after the import is complete`,
    })
  }

  const uploadFiles = async (files: AcceptedFile[], collectionId?: string) => {
    const fileUploadPromises = files.map(async ({ file }) => {
      return await uploadFileApiCall(file as File)
    })
    return await Promise.all(fileUploadPromises)
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
