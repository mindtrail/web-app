'use client'

import { useState, useEffect, useMemo, useCallback, MouseEventHandler } from 'react'
import { FileRejection } from 'react-dropzone'

import { DataStoreForm, DataStoreFormValues } from '@/components/datastore/form'
import { FileList } from '@/components/datastore/fileList'
import { TypographyH2 } from '@/components/typography/h2'

import { UPLOAD_ENDPOINT, DATASTORE_ENDPOINT, AcceptedFile } from '@/components/datastore/utils'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
}

export function CreateDataStore({ userId }: DataStoreProps) {
  const [processing, setProcessing] = useState(false)

  const onSubmit = async (data: DataStoreFormValues) => {

    const { dataStoreName, files } = data
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
        }),
      })
      const newDS = await dataStore.json()
      const dataStoreId = newDS.id

      if (!dataStoreId) {
        throw new Error('Failed to create DataStore')
      }

      const fileUploadPromises = files.map(({ file }) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('dataStoreId', dataStoreId) // Add this line

        return fetch(UPLOAD_ENDPOINT, {
          method: 'POST',
          body: formData,
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for file ${file.name}`)
          }
          return response.json()
        })
      })

      const fileUploadResults = await Promise.all(fileUploadPromises)
      setProcessing(false)
      console.log(fileUploadResults)
    } catch (err) {
      console.log(err)
      setProcessing(false)
    }

    return
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('file', file)
    })

    // @TODO: Create DataStore
    // const dsName = `DataStore - ${new Date().toLocaleString()}`
    // const newDs = await createDataStore(userId, dsName)

    try {
      const res = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <TypographyH2>Create Knowledge Base</TypographyH2>
      </div>
      <div className='max-w-lg w-full'>
        <DataStoreForm onSubmit={onSubmit} processing={processing}/>
      </div>
    </div>
  )
}
