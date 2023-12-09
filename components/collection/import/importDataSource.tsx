'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { DataSourceStatus } from '@prisma/client'

import { Typography } from '@/components/typography'
import { ImportForm } from '@/components/collection/import/form'
import { CollectionFormValues } from '@/components/collection/utils'
import { useToast } from '@/components/ui/use-toast'
import { GlobalStateContext } from '@/context/global-state'

import { uploadFileApiCall } from '@/lib/api/dataSource'
import { scrapeURLs } from '@/lib/serverActions/dataSource'

interface ImportDataSource extends React.ComponentProps<'div'> {
  userId: string
}

export function ImportDataSource({ userId }: ImportDataSource) {
  const [state, dispatch] = useContext(GlobalStateContext)

  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (data: CollectionFormValues) => {
    try {
      await updateCollection(data)

      router.push('/search?refresh=true')
    } catch (err) {
      console.log(err)

      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong. Data was not imported properly`,
      })
    }
  }

  const onScrapeWebsite = async (url: string) => {
    const res = await fetch(`/api/scraper?urls=${url}`)
    const data = await res.json()
    console.log(data)
  }

  const updateCollection = async (data: CollectionFormValues) => {
    const { name, description, files, urls, newURL } = data

    // TODO: Add dropdown to select collection
    // const {
    //   id: collectionId,
    //   name: existingName,
    //   description: existingDescription,
    // } = existingCollection

    const unsynchedFiles = files?.filter(
      ({ status }) => status === DataSourceStatus.unsynched,
    )

    if (newURL) {
      // @TODO: If I will add https:// automatically, it should be done here
      const urlList = newURL.split(',').map((url) => url.trim())
      scrapeURLs(urlList)
    }
    // We only upload files if there are changes
    if (unsynchedFiles?.length) {
      await uploadFiles(unsynchedFiles)
    }

    // Those are the only async operations
    if (urls?.length || unsynchedFiles?.length) {
      // dispatch({
      // type: 'ADD_UNSYNCED_DATA_STORE',
      // payload: { id: collectionId },
      // })
    }

    toast({
      title: 'Data imported',
      description: `Data Store has been updated`,
    })
  }

  const uploadFiles = async (files: AcceptedFile[], collectionId?: string) => {
    const fileUploadPromises = files.map(async ({ file }) => {
      return await uploadFileApiCall(file as File)
    })
    const res = await Promise.allSettled(fileUploadPromises)
    return res
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
