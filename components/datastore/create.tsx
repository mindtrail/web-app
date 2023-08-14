'use client'

import { useState, useEffect, useMemo, useCallback, MouseEventHandler } from 'react'
import { useDropzone } from 'react-dropzone'

import { DataStoreForm } from '@/components/datastore/form'
import { TypographyH2 } from '@/components/typography/h2'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  UPLOAD_ENDPOINT,
  METADATA_ENDPOINT,
} from '@/components/datastore/constants'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
}

export function CreateDataStore({ userId }: DataStoreProps) {
  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_REACT_DROPZONE,
    onDrop: async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) {
        return
      }

      const formData = new FormData()

      acceptedFiles.forEach((file) => {
        formData.append('file', file)
      })

      const res = await fetch(METADATA_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error.message)
        })

      setFiles(files.concat(acceptedFiles))
    },
  })

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async () => {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('file', file)
    })

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
        <DataStoreForm />
      </div>
    </div>
  )
}
