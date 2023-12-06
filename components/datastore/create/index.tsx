'use client'

import { useRouter } from 'next/navigation'
import { DataSourceStatus } from '@prisma/client'

import { Typography } from '@/components/typography'
import { DataStoreForm } from '@/components/datastore/create/form'
import { DataStoreFormValues } from '@/components/datastore/utils'
import { useToast } from '@/components/ui/use-toast'
import { GlobalStateContext } from '@/context/global-state'
import { useContext } from 'react'

import { uploadFileApiCall, scrapeURLsApiCall } from '@/lib/api/dataSrc'
import {
  createDataStoreApiCall,
  updateDataStoreApiCall,
} from '@/lib/api/dataStore'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
  dataStore?: CollectionExtended
}

export function CreateCollection({
  userId,
  dataStore: existingDataStore,
}: DataStoreProps) {
  const [state, dispatch] = useContext(GlobalStateContext)

  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (data: DataStoreFormValues) => {
    const actionType = existingDataStore ? 'updated' : 'created'
    const functionToCall = existingDataStore ? updateDataStore : createDataStore

    try {
      await functionToCall(data)

      router.push('/search?refresh=true')
    } catch (err) {
      console.log(err)

      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong. ${data?.name} was not ${actionType} properly`,
      })
    }
  }

  const onScrapeWebsite = async (url: string) => {
    const res = await fetch(`/api/scraper?urls=${url}`)
    const data = await res.json()
  }

  const createDataStore = async (data: DataStoreFormValues) => {
    const { name, description, files, newURL } = data
    const dsPayload = { userId, name, description }

    const newDataStore = await createDataStoreApiCall(dsPayload)
    const dataStoreId = newDataStore.id

    if (newURL) {
      // @TODO: If I will add https:// automatically, it should be done here
      const urlList = newURL.split(',').map((url) => url.trim())
      scrapeURLsApiCall(urlList, dataStoreId)
    }

    if (files?.length) {
      await uploadFiles(files, newDataStore.id)
    }

    dispatch({
      type: 'ADD_UNSYNCED_DATA_STORE',
      payload: { id: dataStoreId },
    })

    toast({
      title: 'Knowledge Base created',
      description: `${name} has been created`,
    })

    return { id: dataStoreId }
  }

  const updateDataStore = async (data: DataStoreFormValues) => {
    if (!existingDataStore) {
      return
    }

    const { name, description, files, urls, newURL } = data
    const {
      id: dataStoreId,
      name: existingName,
      description: existingDescription,
    } = existingDataStore

    const unsynchedFiles = files?.filter(
      ({ status }) => status === DataSourceStatus.unsynched,
    )

    // We only add the name and description if they are different from the existing ones
    const dsPayload = { userId } as Partial<CreateCollection>
    if (name !== existingName) {
      dsPayload.name = name
    }
    if (description !== existingDescription) {
      dsPayload.description = description
    }

    // We only update the datastore if there are changes
    if (dsPayload.name || dsPayload.description) {
      await updateDataStoreApiCall(dataStoreId, dsPayload)
    }

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
      title: 'Knowledge Base updated',
      description: `${name} has been updated`,
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
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <Typography variant='h2'>
          {existingDataStore ? 'Edit' : ' Create'} Knowledge Base
        </Typography>
      </div>
      <div className='max-w-xl w-full'>
        <DataStoreForm
          onSubmit={onSubmit}
          existingDataStore={existingDataStore}
          onScrapeWebsite={onScrapeWebsite}
        />
      </div>
    </div>
  )
}
