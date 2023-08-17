import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { DataSourceStatus } from '@prisma/client'

import { FormList } from '@/components/datastore/create/formList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSpinner } from '@/components/ui/icons'
import { deleteFileApiCall } from '@/lib/api/dataStore'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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
  filterFiles,
  updateFilesWithMetadata,
  dataStoreFormSchema,
  getFormInitialValues,
  DataStoreFormValues,
} from '@/components/datastore/utils'

type FormProps = {
  onSubmit: (data: DataStoreFormValues) => Promise<void>
  getFilesMetadata: (files: AcceptedFile[]) => Promise<Metadata[]>
  existingDataStore?: DataStoreExtended
}

export type DeleteHandler = (event: React.MouseEvent<HTMLButtonElement>, file: AcceptedFile) => void

export function DataStoreForm(props: FormProps) {
  const { onSubmit, getFilesMetadata, existingDataStore } = props

  const defaultValues: DataStoreFormValues = useMemo(
    () => getFormInitialValues(existingDataStore),
    [existingDataStore],
  )

  const [files, setFiles] = useState<AcceptedFile[]>(defaultValues?.files || [])
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([])

  const [dropzoneUsed, setDropzoneUsed] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [charCountLoading, setCharCountLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<AcceptedFile | null>(null)

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

  async function handleDrop(droppedFiles: File[]) {
    if (!droppedFiles.length) {
      return
    }

    const remainingSlots = MAX_NR_OF_FILES - files.length
    // Filter files based on size and nr limit
    let { acceptedFiles, rejectedFiles } = filterFiles(droppedFiles, remainingSlots)

    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    setRejectedFiles(rejectedFiles)
    setCharCountLoading(true)
    setDropzoneUsed(true) // User has interacted with the dropzone
    try {
      const metadataForFiles = (await getFilesMetadata(acceptedFiles)) as Metadata[]
      console.log(metadataForFiles)
      const totalChars = metadataForFiles.reduce((acc, { charCount }) => acc + charCount, 0)

      setFiles((prevFiles) => updateFilesWithMetadata(prevFiles, metadataForFiles))
      setCharCount((prevChars) => prevChars + totalChars)
      setCharCountLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const confirmFileDelete = async () => {
    if (!fileToDelete) {
      return
    }

    const { file } = fileToDelete

    console.log(file)
    try {
      // @ts-ignore
      deleteFileApiCall(file.id).then((res) => {
        console.log(res)
        // toast...
      })
    } catch (err) {
      console.log(err)
    }

    filterOutDeletedFileAndUpdateCharCount(fileToDelete)
  }

  const handleFileDelete: DeleteHandler = (event, file) => {
    event.preventDefault()

    if (!file) {
      return
    }

    if (file.status === DataSourceStatus.synched) {
      setFileToDelete(file)
      setDeleteDialogOpen(true)
      return
    }

    filterOutDeletedFileAndUpdateCharCount(file)
  }

  const filterOutDeletedFileAndUpdateCharCount = (fileToDelete: AcceptedFile) => {
    const { file, charCount = 0, status } = fileToDelete

    setFiles((prevFiles) =>
      prevFiles.filter(({ file: prevFile }) => {
        return prevFile.name !== file.name
      }),
    )
    setCharCount((prevChars) => prevChars - charCount)
  }

  const onFormSumbit = async (data: DataStoreFormValues) => {
    console.log('submitting')
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
    <>
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
          <FormList
            acceptedFiles={files}
            rejectedFiles={rejectedFiles}
            charCount={charCount}
            charCountLoading={charCountLoading}
            handleFileDelete={handleFileDelete}
          />

          <Button type='submit' size='lg' disabled={processing}>
            {processing && <IconSpinner className='mr-2' />}
            {existingDataStore ? 'Edit' : 'Create'}
          </Button>
        </form>
      </Form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the file and the associated data. The action cannot be undone and
              will permanently delete {'file--name'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={() => {
                confirmFileDelete()
                setDeleteDialogOpen(false)
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
