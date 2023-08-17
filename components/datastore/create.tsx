'use client'

import Typography from '@/components/typography'
import { DataStoreForm, DataStoreFormValues } from '@/components/datastore/form'
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
  const onSubmit = async (data: DataStoreFormValues) => {
    const { name, description, files } = data

    try {
      const dataStore = await createDataStoreApiCall({ userId, name, description })
      const dataStoreId = dataStore.id

      const fileUploadPromises = files.map(async ({ file }) => {
        return await uploadFileApiCall(file, dataStoreId)
      })

      const res = await Promise.all(fileUploadPromises)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  const getFilesMetadata = async (files: File[]) => {
    const metadataPromises = files.map(async (file) => await getFileMetadataApiCall(file))
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
