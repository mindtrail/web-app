'use client'

import { useState, useEffect, useMemo, useCallback, MouseEventHandler } from 'react'
import { useDropzone } from 'react-dropzone'

import { IconSpinner } from '@/components/ui/icons'
import { Button, type ButtonProps } from '@/components/ui/button'

import { DataStoreForm } from '@/components/datastore/form'
import { TypographyH1 } from '@/components/typography/h1'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  MAX_NR_OF_FILES,
  UPLOAD_ENDPOINT,
  METADATA_ENDPOINT,
  UPLOAD_LABEL,
} from '@/components/datastore/constants'

interface DataStoreProps extends React.ComponentProps<'div'> {
  dataStoreId: string
}

const defaultStyles = 'border-neutral-300 bg-neutral-50'
const rejectStyles = 'border-red-400 bg-neutral-300 cursor-not-allowed text-neutral-800'
const acceptStyles = 'border-green-600 bg-green-50'

export function CreateDataStore({ dataStoreId }: DataStoreProps) {
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
        <TypographyH1>Create Chatbot</TypographyH1>
      </div>
      <div className='max-w-lg w-full'>
        <DataStoreForm />
      </div>

      <Button variant='default' size='wide' onClick={handleSubmit}>
        Continue
      </Button>
    </div>
  )
}
