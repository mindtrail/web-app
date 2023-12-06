'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { DataSrcStatus } from '@prisma/client'

import { Typography } from '@/components/typography'
import { ImportForm } from '@/components/datastore/import/form'
import { DataStoreFormValues } from '@/components/datastore/utils'
import { useToast } from '@/components/ui/use-toast'
import { GlobalStateContext } from '@/context/global-state'

import { uploadFileApiCall, scrapeURLsApiCall } from '@/lib/api/dataSrc'

interface ImportDataSrc extends React.ComponentProps<'div'> {
  userId: string
  dataStore: CollectionExtended
}

export function ImportDataSrc({
  userId,
  dataStore: existingDataStore,
}: ImportDataSrc) {
  const [state, dispatch] = useContext(GlobalStateContext)

  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (data: DataStoreFormValues) => {
    try {
      await updateDataStore(data)

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

  const updateDataStore = async (data: DataStoreFormValues) => {
    const { name, description, files, urls, newURL } = data
    const {
      id: dataStoreId,
      name: existingName,
      description: existingDescription,
    } = existingDataStore

    const unsynchedFiles = files?.filter(
      ({ status }) => status === DataSrcStatus.unsynched,
    )

    if (newURL) {
      // @TODO: If I will add https:// automatically, it should be done here
      const urlList = newURL.split(',').map((url) => url.trim())
      scrapeURLsApiCall(urlList, dataStoreId)
    }
    // We only upload files if there are changes
    if (unsynchedFiles?.length) {
      await uploadFiles(unsynchedFiles, dataStoreId)
    }

    // Those are the only async operations
    if (urls?.length || unsynchedFiles?.length) {
      dispatch({
        type: 'ADD_UNSYNCED_DATA_STORE',
        payload: { id: dataStoreId },
      })
    }

    toast({
      title: 'Data imported',
      description: `Data Store has been updated`,
    })
  }

  const uploadFiles = async (files: AcceptedFile[], dataStoreId: string) => {
    const fileUploadPromises = files.map(async ({ file }) => {
      return await uploadFileApiCall(file as File, dataStoreId)
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
          existingDataStore={existingDataStore}
          onScrapeWebsite={onScrapeWebsite}
        />
      </div>
    </div>
  )
}
