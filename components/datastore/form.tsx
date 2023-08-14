'use client'

import { useState, useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDropzone, FileRejection } from 'react-dropzone'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  DROPZONE_STYLES,
  MAX_NR_OF_FILES,
  MAX_FILE_SIZE,
  UPLOAD_ENDPOINT,
  METADATA_ENDPOINT,
  UPLOAD_LABEL,
  filterFilesBySize,
  getFileRejectionsMaxFiles,
} from '@/components/datastore/utils'

import { formatDate } from '@/lib/utils'

const dataStoreFormSchema = z.object({
  dataStoreName: z
    .string()
    .min(4, {
      message: 'Name must be at least 4 characters.',
    })
    .max(40, {
      message: 'Name must not be longer than 40 characters.',
    }),
  files: z.array(z.any()).min(1, {
    message: 'You must upload at least one valid file.',
  }),
})

export type DataStoreFormValues = z.infer<typeof dataStoreFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DataStoreFormValues> = {
  dataStoreName: `Knowledge Base - ${formatDate(new Date())}`,
  files: [],
}

type FormProps = {
  onSubmit: (data: DataStoreFormValues) => void
}

type FileFilter = {
  validFiles: File[]
  rejectedFiles: FileRejection[]
}

export function DataStoreForm({ onSubmit }: FormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

  const [dropzoneUsed, setDropzoneUsed] = useState(false)

  const form = useForm<DataStoreFormValues>({
    resolver: zodResolver(dataStoreFormSchema),
    defaultValues,
    mode: 'onChange',
    shouldFocusError: false, // Prevents auto focusing on the first error, which can trigger error displays immediately.
  })

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_REACT_DROPZONE,
    // maxFiles: MAX_NR_OF_FILES,
    // maxSize: MAX_FILE_SIZE,
    onDrop: async (acceptedFiles: File[]) => {
      console.log(acceptedFiles)

      if (!acceptedFiles.length) {
        return
      }

      // Filter files based on size
      let { validFiles, rejectedFiles } = filterFilesBySize(acceptedFiles)

      // Check how many files we can add based on maxFiles
      const remainingSlots = MAX_NR_OF_FILES - files.length

      if (validFiles.length > remainingSlots) {
        const excessFiles = validFiles.slice(remainingSlots)
        // Truncate validFiles to the remainingSlots
        validFiles.length = remainingSlots
        // Add the excess files to the rejectedFiles list
        rejectedFiles = [...rejectedFiles, ...getFileRejectionsMaxFiles(excessFiles)]
      }

      // Only use the first x files and the ones that have a size smaller than the max size.
      setDropzoneUsed(true) // User has interacted with the dropzone

      setFiles((prevFiles) => [...prevFiles, ...validFiles])

      if (rejectedFiles.length) {
        // Update your rejected files list state (assuming you have a state for this)
        setRejectedFiles(rejectedFiles)
      }
    },
  })

  const { handleSubmit, control } = form

  useEffect(() => {
    if (dropzoneUsed) {
      form.setValue('files', files)
      form.trigger('files')
    }
  }, [files, form, dropzoneUsed])

  const dropzoneInteractionClasses = useMemo(() => {
    if (isDragReject) {
      return DROPZONE_STYLES.REJECT
    }
    if (isDragAccept) {
      return DROPZONE_STYLES.ACCEPT
    }

    return DROPZONE_STYLES.DEFAULT
  }, [isDragAccept, isDragReject])

  const acceptedFileList = useMemo(() => {
    return files.map((file: File) => <p key={file.name}>{file.name}</p>)
  }, [files])

  const rejectedFileList = useMemo(() => {
    return rejectedFiles.map(({ file }: FileRejection) => <p key={file.name}>{file.name}</p>)
  }, [rejectedFiles])

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={control}
          name='dataStoreName'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormMessage className='absolute' />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='files'
          render={() => (
            <FormItem className='relative'>
              <FormLabel>Upload Files</FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`flex flex-col w-full h-28 rounded-xl justify-center
                  border items-center gap-4 text-neutral-600
                  select-none cursor-default transition .25s ease-in-out
                  ${dropzoneInteractionClasses}`}
                >
                  <input {...getInputProps()} />
                  {isDragReject ? (
                    'Unsupported file type!'
                  ) : (
                    <>
                      <p>
                        Drop files or <span className='underline text-neutral-500'>Click</span> to
                        browse
                      </p>
                      <p className='text-sm text-neutral-500'>
                        <span>Supported file types:</span> .pdf, .docx, .txt, .md, .json, .jsonl,
                        .csv
                      </p>
                    </>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>{files.length > 0 && `${files.length} of ${MAX_NR_OF_FILES} uploaded`}</div>
        <div className='max-w-lg w-full flex-1 relative flex flex-col gap-2'>
          {acceptedFileList}
        </div>

        <div className='max-w-lg w-full flex-1 relative flex flex-col gap-2 text-red-800'>
          {rejectedFileList}
        </div>

        <Button type='submit' size='lg'>
          Create
        </Button>
      </form>
    </Form>
  )
}
