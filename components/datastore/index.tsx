'use client'

import { useState, MouseEventHandler } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

import { IconSpinner } from '@/components/ui/icons'
import { Button, type ButtonProps } from '@/components/ui/button'

import {
  ACCEPTED_FILE_TYPES,
  MAX_NR_OF_FILES,
  UPLOAD_ENDPOINT,
  UPLOAD_LABEL,
} from '@/components/datastore/constants'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImagePreview)
registerPlugin(FilePondPluginFileValidateType)

interface DataStoreProps extends React.ComponentProps<'div'> {}

export function CreateDataStore(props: DataStoreProps) {
  const [files, setFiles] = useState([])
  const [isInitializing, setIsInitializing] = useState(true)

  const handleUpdateFiles = (fileItems: any) => {
    console.log(fileItems)
    // Set current file objects to state
    setFiles(fileItems.map(async (fileItem: any) => fileItem.file))
  }
  const handleInit = () => {
    console.log('FilePond instance has initialised')
    setIsInitializing(false)
  }
  const handleUploadFinish = () => {
    console.log('Upload finished', files)
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {}

  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <h1 className='mb-2 text-lg font-semibold text-center'>Create Chatbot</h1>
        <p>Step 1</p>
      </div>
      <div className='max-w-md w-full flex-1 relative'>
        <FilePond
          allowMultiple={true}
          credits={false}
          files={files}
          labelIdle={UPLOAD_LABEL}
          maxFiles={MAX_NR_OF_FILES}
          oninit={handleInit}
          onupdatefiles={handleUpdateFiles}
          onprocessfile={handleUploadFinish}
          server={UPLOAD_ENDPOINT}
          acceptedFileTypes={ACCEPTED_FILE_TYPES}
        ></FilePond>
        {isInitializing ? (
          <div className='flex w-full h-[76px] bg-muted justify-center items-center absolute top-0'>
            <IconSpinner className='mr-2 animate-spin' />{' '}
            <span className='text-muted-foreground'>Loading...</span>
          </div>
        ) : null}
      </div>
      <Button variant='default' size='wide' onClick={handleClick}>
        Continue
      </Button>
    </div>
  )
}
