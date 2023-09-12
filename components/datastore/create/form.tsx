import React, { useState, useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { DataSrc, DataSrcStatus } from '@prisma/client'

import { FormList } from '@/components/datastore/create/formFileList'
import { deleteFileApiCall } from '@/lib/api/dataStore'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSpinner } from '@/components/ui/icons'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import {
  AlertDialog,
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
  FormDescription,
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
  onScrapeWebsite?: (url: string) => Promise<void>
  onSubmit: (data: DataStoreFormValues) => Promise<void>
  getFilesMetadata: (files: AcceptedFile[]) => Promise<Metadata[]>
  existingDataStore?: DataStoreExtended
}

export type DeleteHandler = (
  event: React.MouseEvent<HTMLButtonElement>,
  file: AcceptedFile,
) => void

export function DataStoreForm(props: FormProps) {
  const { onSubmit, getFilesMetadata, existingDataStore, onScrapeWebsite } =
    props

  const defaultValues: DataStoreFormValues = useMemo(
    () => getFormInitialValues(existingDataStore),
    [existingDataStore],
  )

  const { toast } = useToast()

  const [files, setFiles] = useState<AcceptedFile[]>(defaultValues?.files || [])
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([])

  const [dropzoneUsed, setDropzoneUsed] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [charCountLoading, setCharCountLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<AcceptedFile | null>(null)
  const [autoCrawl, setAutoCrawl] = useState(true)

  const form = useForm<DataStoreFormValues>({
    resolver: zodResolver(dataStoreFormSchema),
    defaultValues,
    mode: 'onChange',
    shouldFocusError: false, // Prevents auto focusing on the first error, which can trigger error displays immediately.
  })

  const { handleSubmit, control } = form

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
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
    let { acceptedFiles, rejectedFiles } = filterFiles(
      droppedFiles,
      remainingSlots,
    )

    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    setRejectedFiles(rejectedFiles)
    setCharCountLoading(true)
    setDropzoneUsed(true) // User has interacted with the dropzone
    try {
      const metadataForFiles = (await getFilesMetadata(
        acceptedFiles,
      )) as Metadata[]
      const totalChars = metadataForFiles.reduce(
        (acc, { charCount }) => acc + charCount,
        0,
      )

      setFiles((prevFiles) =>
        updateFilesWithMetadata(prevFiles, metadataForFiles),
      )
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

    try {
      const { id, name } = fileToDelete.file as DataSrc
      deleteFileApiCall(id).then((res) => {
        toast({
          title: 'File deleted',
          description: `${name} has been deleted`,
        })
        console.log(res)
      })
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${name}`,
      })
      console.log(err)
    }

    filterOutDeletedFileAndUpdateCharCount(fileToDelete)
  }

  const handleFileDelete: DeleteHandler = (event, file) => {
    event.preventDefault()

    if (!file) {
      return
    }

    if (file.status === DataSrcStatus.synched) {
      setFileToDelete(file)
      setDeleteDialogOpen(true)
      return
    }

    filterOutDeletedFileAndUpdateCharCount(file)
  }

  const filterOutDeletedFileAndUpdateCharCount = (
    fileToDelete: AcceptedFile,
  ) => {
    const { file, charCount = 0, status } = fileToDelete

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
  }

  const handleWebsiteScrape = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()

    if (onScrapeWebsite) {
      // const url = window.prompt('Enter a URL to scrape')
      onScrapeWebsite('https://www.fuer-gruender.de/')
    }
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
                  <Input
                    onClick={() => console.log(field)}
                    placeholder='What the KB contains'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='absolute' />
              </FormItem>
            )}
          />
          <Tabs defaultValue='urls'>
            <TabsList className='grid w-full grid-cols-2 '>
              <TabsTrigger value='files'>Documents</TabsTrigger>
              <TabsTrigger value='urls'>Website</TabsTrigger>
            </TabsList>
            <TabsContent value='files'>
              <div className='flex flex-col gap-4 mt-4'>
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
                                Drop files or{' '}
                                <span className='underline text-neutral-500'>
                                  Click
                                </span>{' '}
                                to browse
                              </p>
                              <p className='text-sm text-neutral-500'>
                                <span>Supported file types:</span> .pdf, .docx,
                                .txt, .md, .json, .jsonl, .csv
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
              </div>
            </TabsContent>
            <TabsContent value='urls'>
              <div className='flex flex-col gap-4 min-h-[184px] mt-4'>
                <div className='flex w-full flex-col items-start gap-4'>
                  <FormField
                    control={control}
                    name='urls'
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://your-website.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='absolute' />
                      </FormItem>
                    )}
                  />
                  <div className='flex items-center gap-4'>
                    <Switch
                      id='autoCrawl'
                      checked={autoCrawl}
                      onCheckedChange={() => setAutoCrawl(!autoCrawl)}
                    />
                    <Label htmlFor='autoCrawl' className='w-20'>
                      {autoCrawl ? 'Automatic' : 'Manual'}
                    </Label>
                    <FormDescription>
                      {autoCrawl
                        ? 'Crawls all website pages, including sitemap links.'
                        : 'Fetch the links you want to crawl and add them to the list.'}
                    </FormDescription>
                  </div>
                </div>

                {!autoCrawl && (
                  <Button
                    onClick={handleWebsiteScrape}
                    variant='secondary'
                    size='lg'
                    disabled={processing}
                  >
                    {processing && <IconSpinner className='mr-2' />}
                    Fetch Links
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className='flex justify-between w-full'>
            <Button type='submit' size='lg' disabled={processing}>
              {processing && <IconSpinner className='mr-2' />}
              {existingDataStore ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the file and the associated data. The action
              cannot be undone and will permanently delete{' '}
              <b>{fileToDelete?.file?.name}</b>.
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
