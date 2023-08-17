import React, { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDropzone, FileRejection } from 'react-dropzone'
import * as z from 'zod'

import { FileList } from '@/components/datastore/fileList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSpinner } from '@/components/ui/icons'

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
} from '@/components/datastore/constants'

import {
  filterFilesBySize,
  getFilesOverLimit,
  updateFilesWithMetadata,
} from '@/components/datastore/utils'

import { formatDate } from '@/lib/utils'
import { getFilesMetadataApiCall } from '@/lib/api/dataStore'

const dataStoreFormSchema = z.object({
  dataStoreName: z
    .string()
    .min(4, {
      message: 'Name must be at least 5 characters.',
    })
    .max(40, {
      message: 'Name must not be longer than 40 characters.',
    }),
  dataStoreDescription: z
    .string()
    .min(4, {
      message: 'Description must be at least 5 characters.',
    })
    .max(100, {
      message: 'Description must not be longer than 100 characters.',
    }),
  files: z.array(z.any()).min(1, {
    message: 'You must upload at least one valid file.',
  }),
})

export type DataStoreFormValues = z.infer<typeof dataStoreFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DataStoreFormValues> = {
  dataStoreName: `KB - ${formatDate(new Date())}`,
  files: [],
}

type FormProps = {
  onSubmit: (data: DataStoreFormValues) => void
  processing: boolean
  files: AcceptedFile[]
  setFiles: React.Dispatch<React.SetStateAction<AcceptedFile[]>>
  rejectedFiles: FileRejection[]
  setRejectedFiles: React.Dispatch<React.SetStateAction<FileRejection[]>>
  dropzoneUsed: boolean
  setDropzoneUsed: React.Dispatch<React.SetStateAction<boolean>>
  charCount: number
  setCharCount: React.Dispatch<React.SetStateAction<number>>
  charCountLoading: boolean
  setCharCountLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function DataStoreForm(props: FormProps) {
  const {
    onSubmit,
    processing,
    files,
    setFiles,
    rejectedFiles,
    setRejectedFiles,
    dropzoneUsed,
    setDropzoneUsed,
    charCount,
    setCharCount,
    charCountLoading,
    setCharCountLoading,
  } = props

  const form = useForm<DataStoreFormValues>({
    resolver: zodResolver(dataStoreFormSchema),
    defaultValues,
    mode: 'onChange',
    shouldFocusError: false, // Prevents auto focusing on the first error, which can trigger error displays immediately.
  })

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_REACT_DROPZONE,
    validator: (file) => {
      const { name, type } = file

      if (files.some(({ file }) => file.name === name && file.type === type)) {
        return {
          code: 'file-already-added',
          message: 'File already added',
        }
      }

      return null
    },

    onDrop: async (acceptedFiles: File[]) => {
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
        rejectedFiles = [...rejectedFiles, ...getFilesOverLimit(excessFiles)]
      }

      if (rejectedFiles.length) {
        // Update your rejected files list state (assuming you have a state for this)
        setRejectedFiles(rejectedFiles)
      }

      setFiles((prevFiles) => [...prevFiles, ...validFiles.map((file) => ({ file }))])
      setDropzoneUsed(true) // User has interacted with the dropzone
      setCharCountLoading(true)

      try {
        const filesMetadata = (await getFilesMetadataApiCall(validFiles)) as Metadata[]
        const totalChars = filesMetadata.reduce((acc, { charCount }) => acc + charCount, 0)

        setFiles((prevFiles) => updateFilesWithMetadata(prevFiles, filesMetadata))
        setCharCount((prevChars) => prevChars + totalChars)
        setCharCountLoading(false)
      } catch (error) {
        console.log(error)
      }
    },
  })

  const handleDelete = (fileToDelete: AcceptedFile) => {
    if (!fileToDelete) {
      return
    }
    const { file, charCount = 0 } = fileToDelete

    setFiles((prevFiles) => prevFiles.filter(({ file: prevFile }) => prevFile.name !== file.name))
    setCharCount((prevChars) => prevChars - charCount)
  }

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
                <Input placeholder='Knowledge Base Name' {...field} />
              </FormControl>
              <FormMessage className='absolute' />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='dataStoreDescription'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='What the KB contains' {...field} />
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
        <FileList
          acceptedFiles={files}
          rejectedFiles={rejectedFiles}
          charCount={charCount}
          charCountLoading={charCountLoading}
          handleDelete={handleDelete}
        />

        <Button type='submit' size='lg' disabled={processing}>
          {processing && <IconSpinner className='mr-2' />}
          Create
        </Button>
      </form>
    </Form>
  )
}
