'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { DataStoreForm, DataStoreFormValues } from '@/components/datastore/form'
import Typography from '@/components/typography'

import { UPLOAD_ENDPOINT, DATASTORE_ENDPOINT } from '@/components/datastore/constants'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
  dataStore?: DataStoreExtended
}

export function CreateDataStore({ userId }: DataStoreProps) {
  const [processing, setProcessing] = useState(false)

  const router = useRouter()

  const onSubmit = async (data: DataStoreFormValues) => {
    const { dataStoreName, dataStoreDescription, files } = data
    setProcessing(true)

    try {
      const dataStore = await fetch(DATASTORE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          dataStoreName,
          dataStoreDescription,
        }),
      })
      const newDS = await dataStore.json()
      const dataStoreId = newDS.id

      if (!dataStoreId) {
        throw new Error('Failed to create DataStore')
      }

      const fileUploadPromises = files.map(async ({ file }) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('dataStoreId', dataStoreId) // Add this line

        const response = await fetch(UPLOAD_ENDPOINT, {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata for file ${file.name}`)
        }
        return await response.json()
      })

      await Promise.all(fileUploadPromises)

      router.push('/datastore')
    } catch (err) {
      console.log(err)
      setProcessing(false)
    }
  }

  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <Typography variant='h2'>Create Knowledge Base</Typography>
      </div>
      <div className='max-w-lg w-full'>
        <DataStoreForm onSubmit={onSubmit} processing={processing} />
      </div>
    </div>
  )
}
