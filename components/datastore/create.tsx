'use client'

import { useState, useEffect, useMemo, useCallback, MouseEventHandler } from 'react'
import { useDropzone } from 'react-dropzone'

import { DataStoreForm, DataStoreFormValues } from '@/components/datastore/form'
import { TypographyH2 } from '@/components/typography/h2'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  UPLOAD_ENDPOINT,
  METADATA_ENDPOINT,
  DATASTORE_ENDPOINT,
} from '@/components/datastore/utils'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
}

export function CreateDataStore({ userId }: DataStoreProps) {
  const onSubmit = async (data: DataStoreFormValues) => {
    console.log(1234, data)
    const { dataStoreName, files } = data

    try {
      const res = await fetch(DATASTORE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          dataStoreName,
        }),
      })
      const data = await res.json()
    } catch (err) {
      console.log(err)
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
        <DataStoreForm onSubmit={onSubmit} />
      </div>
    </div>
  )
}
