'use client'

import { useRouter } from 'next/navigation'

import Typography from '@/components/typography'
import { DataStoreForm } from '@/components/datastore/create/form'
import { DataStoreFormValues } from '@/components/datastore/utils'

import {
  createDataStoreApiCall,
  uploadFileApiCall,
  getFileMetadataApiCall,
} from '@/lib/api/dataStore'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
  dataStore?: DataStoreExtended
}

export function CreateDataStore({ userId, dataStore }: DataStoreProps) {
  const router = useRouter()

  const onSubmit = async (data: DataStoreFormValues) => {
    try {
      const dataStore = await createDataStore(data)
      router.push('/datastore')

      return dataStore
    } catch (err) {
      console.log(err)
    }
  }

  const createDataStore = async (data: DataStoreFormValues) => {
    const { name, description, files } = data

    const dataStore = await createDataStoreApiCall({ userId, name, description })
    const uploadedFiles = await uploadFiles(files, dataStore.id)

    return { dataStore, files: uploadedFiles }
  }

  const uploadFiles = async (files: AcceptedFile[], dataStoreId: string) => {
    const fileUploadPromises = files.map(async ({ file }) => {
      return await uploadFileApiCall(file as File, dataStoreId)
    })
    const res = await Promise.all(fileUploadPromises)
    return res
  }

  const editDataStore = async (data: DataStoreFormValues) => {}

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
        <Typography variant='h2'>{dataStore ? 'Edit' : ' Create'} Knowledge Base</Typography>
      </div>
      <div className='max-w-lg w-full'>
        <DataStoreForm
          onSubmit={onSubmit}
          getFilesMetadata={getFilesMetadata}
          existingDataStore={dataStore}
        />
      </div>
    </div>
  )
}
