import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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

import { formatDate } from '@/lib/utils'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  DROPZONE_STYLES,
  MAX_NR_OF_FILES,
} from '@/components/datastore/constants'

import {
  filterFilesBySize,
  mapFilesOverLimit,
  updateFilesWithMetadata,
  dataStoreFormSchema,
} from '@/components/datastore/utils'

export type DataStoreFormValues = z.infer<typeof dataStoreFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DataStoreFormValues> = {
  name: `KB - ${formatDate(new Date())}`,
  description: '',
  files: [],
}

type FormProps = {
  onSubmit: (data: DataStoreFormValues) => Promise<void>
  getFilesMetadata: (files: File[]) => Promise<Metadata[]>
  existingDataStore?: DataStoreExtended
}

export function DataStoreForm(props: FormProps) {
  const { onSubmit, getFilesMetadata, existingDataStore } = props

  const editingForm = !!existingDataStore

  const [files, setFiles] = useState<AcceptedFile[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([])

  const [dropzoneUsed, setDropzoneUsed] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [charCountLoading, setCharCountLoading] = useState(false)
  const [processing, setProcessing] = useState(false)

  const router = useRouter()

  const form = useForm<DataStoreFormValues>({
    resolver: zodResolver(dataStoreFormSchema),
    defaultValues,
    mode: 'onChange',
    shouldFocusError: false, // Prevents auto focusing on the first error, which can trigger error displays immediately.
  })

  const { handleSubmit, control } = form

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_REACT_DROPZONE,
    validator: formValidator,
    onDrop: handleDrop,
  })

  function formValidator(file: File) {
    const { name, type } = file

    if (files.some(({ file }) => file.name === name && file.type === type)) {
      return {
        code: 'file-already-added',
        message: 'File already added',
      }
    }

    return null
  }

  async function handleDrop(acceptedFiles: File[]) {
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
      rejectedFiles = [...rejectedFiles, ...mapFilesOverLimit(excessFiles)]
    }

    if (rejectedFiles.length) {
      // Update your rejected files list state (assuming you have a state for this)
      setRejectedFiles(rejectedFiles)
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles.map((file) => ({ file }))])
    setDropzoneUsed(true) // User has interacted with the dropzone
    setCharCountLoading(true)
    try {
      const metadataForFiles = (await getFilesMetadata(validFiles)) as Metadata[]
      console.log(metadataForFiles)
      const totalChars = metadataForFiles.reduce((acc, { charCount }) => acc + charCount, 0)

      setFiles((prevFiles) => updateFilesWithMetadata(prevFiles, metadataForFiles))
      setCharCount((prevChars) => prevChars + totalChars)
      setCharCountLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFileDelete = (fileToDelete: AcceptedFile) => {
    if (!fileToDelete) {
      return
    }
    const { file, charCount = 0 } = fileToDelete

    setFiles((prevFiles) =>
      prevFiles.filter(({ file: prevFile }) => {
        return prevFile.name !== file.name
      }),
    )
    setCharCount((prevChars) => prevChars - charCount)
  }

  const onFormSumbit = async (data: DataStoreFormValues) => {
    setProcessing(true)
    await onSubmit(data)
    setProcessing(false)
    router.push('/datastore')
  }

  useEffect(() => {
    if (dropzoneUsed) {
      form.setValue('files', files)
      form.trigger('files')
    }
  }, [files, form, dropzoneUsed])

  const dropzoneInteractionClasses = useMemo(() => {
    return isDragAccept
      ? DROPZONE_STYLES.ACCEPT
      : isDragReject
      ? DROPZONE_STYLES.REJECT
      : DROPZONE_STYLES.DEFAULT
  }, [isDragAccept, isDragReject])

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSumbit)} className='space-y-8'>
        <FormField
          control={control}
          name='name'
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
          name='description'
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
          handleDelete={handleFileDelete}
        />

        <Button type='submit' size='lg' disabled={processing}>
          {processing && <IconSpinner className='mr-2' />}
          Create
        </Button>
      </form>
    </Form>
  )
}
