'use client'

import { useRouter } from 'next/navigation'
import { DataSrc, DataSrcStatus } from '@prisma/client'

import Typography from '@/components/typography'
import { DataStoreForm } from '@/components/datastore/create/form'
import { DataStoreFormValues } from '@/components/datastore/utils'

import {
  createDataStoreApiCall,
  uploadFileApiCall,
  getFileMetadataApiCall,
  updateDataStoreApiCall,
  scrapeURLsApiCall,
} from '@/lib/api/dataStore'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
  dataStore?: DataStoreExtended
}

export function CreateDataStore({ userId, dataStore }: DataStoreProps) {
  const router = useRouter()

  const onSubmit = async (data: DataStoreFormValues) => {
    try {
      // Create datastore
      if (!dataStore) {
        await createDataStore(data)
        // We force a reload of the page as the datastore list is not updated
        window.location.href = '/datastore'

        return
      }

      await updateDataStore(data)
      window.location.href = '/datastore'

      return
    } catch (err) {
      console.log(err)
    }
  }

  const onScrapeWebsite = async (url: string) => {
    const res = await fetch(`/api/scraper?url=${url}`)
    const data = await res.json()
  }

  const createDataStore = async (data: DataStoreFormValues) => {
    const { name, description, files, urls } = data
    const dsPayload = { userId, name, description }

    // Process URLs
    if (urls?.length) {
      const result = await scrapeURLsApiCall(urls, '1234566')

      console.log(result)
      return
    }

    const newDataStore = await createDataStoreApiCall(dsPayload)

    if (files?.length) {
      await uploadFiles(files, newDataStore.id)
    }
  }

  const updateDataStore = async (data: DataStoreFormValues) => {
    if (!dataStore) {
      return
    }

    const { name, description, files, urls } = data
    const {
      id: dataStoreId,
      name: existingName,
      description: existingDescription,
    } = dataStore

    const unsynchedFiles = files?.filter(
      ({ status }) => status === DataSrcStatus.unsynched,
    )

    // We only add the name and description if they are different from the existing ones
    const dsPayload = { userId } as Partial<CreateDataStore>
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
    // We only upload files if there are changes
    if (unsynchedFiles?.length) {
      await uploadFiles(unsynchedFiles, dataStoreId)
    }
  }

  const uploadFiles = async (files: AcceptedFile[], dataStoreId: string) => {
    const fileUploadPromises = files.map(async ({ file }) => {
      return await uploadFileApiCall(file as File, dataStoreId)
    })
    const res = await Promise.all(fileUploadPromises)
    return res
  }

  const getFilesMetadata = async (files: AcceptedFile[]) => {
    const metadataPromises = files.map(async ({ file }) => {
      const droppedFile = file as File
      return await getFileMetadataApiCall(droppedFile)
    })
    return await Promise.all(metadataPromises)
  }

  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <Typography variant='h2'>
          {dataStore ? 'Edit' : ' Create'} Knowledge Base
        </Typography>
      </div>
      <div className='max-w-lg w-full'>
        <DataStoreForm
          onSubmit={onSubmit}
          getFilesMetadata={getFilesMetadata}
          existingDataStore={dataStore}
          onScrapeWebsite={onScrapeWebsite}
        />
      </div>
    </div>
  )
}
