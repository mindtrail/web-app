import { useState, useEffect, useMemo } from 'react'
import { FileRejection } from 'react-dropzone'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  DROPZONE_STYLES,
  MAX_NR_OF_FILES,
  filterFilesBySize,
  getFileRejectionsMaxFiles,
  getFilesMetadata,
  updateFilesWithMetadata,
  AcceptedFile,
  Metadata,
} from '@/components/datastore/utils'

import { IconSpinner } from '@/components/ui/icons'

interface FileList {
  acceptedFiles: AcceptedFile[]
  rejectedFiles: FileRejection[]
  charCount: number
  charCountLoading: boolean
  handleDelete: (file: AcceptedFile) => void
}

export function FileList(props: FileList) {
  const { acceptedFiles, rejectedFiles, charCount, charCountLoading, handleDelete } = props

  const acceptedFileList = useMemo(() => {
    return acceptedFiles.map(({ file, charCount }) => (
      <div className='flex justify-between items-center' key={file.name}>
        {file.name}

        <div className='flex gap-2'>
          <span>{charCount}</span>
          <Button
            variant='outline'
            size='sm'
            className=''
            onClick={() => {
              handleDelete({ file, charCount })
            }}
          >
            <Cross1Icon />
          </Button>
        </div>
      </div>
    ))
  }, [acceptedFiles, handleDelete])

  const rejectedFileList = useMemo(() => {
    return rejectedFiles.map(({ file }: FileRejection) => <p key={file.name}>{file.name}</p>)
  }, [rejectedFiles])

  return (
    <>
      123
      <div className='flex justify-between items-center'>
        {acceptedFiles.length > 0 && `${acceptedFiles.length} of ${MAX_NR_OF_FILES} uploaded`}
        {charCountLoading ? <IconSpinner className='mr-2 animate-spin' /> : null}
        {charCount > 0 && !charCountLoading && <span>Total chars: {charCount}</span>}
      </div>
      <div className='max-w-lg w-full flex-1 relative flex flex-col gap-2'>{acceptedFileList}</div>
      <div className='max-w-lg w-full flex-1 relative flex flex-col gap-2 text-red-800'>
        {rejectedFileList}
      </div>
    </>
  )
}
