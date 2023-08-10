'use client'

import { useState, useEffect, useMemo, useCallback, MouseEventHandler } from 'react'
import { useDropzone } from 'react-dropzone'

import { IconSpinner } from '@/components/ui/icons'
import { Button, type ButtonProps } from '@/components/ui/button'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  MAX_NR_OF_FILES,
  UPLOAD_ENDPOINT,
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
      setFiles(files.concat(acceptedFiles))
      // setFiles(acceptedFiles.map(file => Object.assign(file, {
      // preview: URL.createObjectURL(file)
      // })));
    },
  })

  console.log(files)

  // useEffect(() => {
  //   // Make sure to revoke the data uris to avoid memory leaks
  //   // files.forEach((file: File) => URL.revokeObjectURL(file.preview))
  // }, [files])

  const fileList = files.map((file: File) => <div key={file.name}>{file.name}</div>)

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
        <h1 className='mb-2 text-lg font-semibold text-center'>Create Chatbot</h1>
        <p>Step 1</p>
      </div>
      <div className='max-w-lg w-full flex-1 relative flex flex-col gap-8'>
        <div
          {...getRootProps()}
          className={`flex flex-col w-full h-28 rounded-xl justify-center
          border items-center gap-4 text-neutral-600
          select-none cursor-default transition .25s ease-in-out
          ${isDragReject ? rejectStyles : isDragAccept ? acceptStyles : defaultStyles}`}
        >
          <input {...getInputProps()} />
          {isDragReject ? (
            'Unsuported file type!'
          ) : (
            <>
              <p>
                Drop files or <span className='underline text-neutral-500'>Click</span> to browse
              </p>
              <p className='text-sm text-neutral-500'>
                <span>Supported file types:</span> .pdf, .docx, .txt, .md, .json, .jsonl, .csv
              </p>
            </>
          )}
        </div>
        {fileList}
      </div>
      <Button variant='default' size='wide' onClick={handleSubmit}>
        Continue
      </Button>
    </div>
  )
}
