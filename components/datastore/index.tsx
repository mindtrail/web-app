'use client'

import { useState, useEffect, MouseEventHandler } from 'react'
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

export function CreateDataStore({ dataStoreId }: DataStoreProps) {
  const [files, setFiles] = useState([])
  const [isInitializing, setIsInitializing] = useState(true)

  const { getRootProps, getInputProps } = useDropzone({
    accept: ACCEPTED_FILE_REACT_DROPZONE,
    // onDrop: acceptedFiles => {
    //   setFiles(acceptedFiles.map(file => Object.assign(file, {
    //     preview: URL.createObjectURL(file)
    //   })));
    // }
  })

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    // files.forEach((file: File) => URL.revokeObjectURL(file.preview))
  }, [files])

  const fileList = files.map((file: File) => <div key={file.name}>{file.name}</div>)

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {}

  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <h1 className='mb-2 text-lg font-semibold text-center'>Create Chatbot</h1>
        <p>Step 1</p>
      </div>
      <div className='max-w-lg w-full flex-1 relative flex flex-col gap-8'>
        <div
          {...getRootProps()}
          className='flex flex-col w-full py-6 rounded-xl justify-center
          border border-neutral-300 bg-neutral-50 items-center gap-4 text-neutral-600
          select-none cursor-default'
        >
          <input {...getInputProps()} />
          <p>
            Drag and drop or <span className='underline text-neutral-500'>Click</span> to select
            files
          </p>
          <p className='text-sm text-neutral-500'>
            <span>Supported file types:</span> .pdf, .docx, .txt, .md, .json, .jsonl, .csv
          </p>
        </div>
        {fileList}
      </div>
      <Button variant='default' size='wide' onClick={handleClick}>
        Continue
      </Button>
    </div>
  )
}
