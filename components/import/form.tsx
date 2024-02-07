import React, { useState, useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { DataSourceType } from '@prisma/client'

import { DataSourceList } from '@/components/collection/create/dataSourceList'
import { useFileHandler } from '@/components/import/useFileHandler'
import { useUrlHandler } from '@/components/import/useUrlHandler'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

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
} from '@/components/collection/constants'

import {
  importFormSchema,
  getFormInitialValues,
  ImportFormValues,
} from '@/components/import/utils'

type FormProps = {
  onScrapeWebsite?: (url: string) => Promise<void>
  onSubmit: (data: ImportFormValues) => Promise<void>
  existingCollection?: CollectionExtended
}

export function ImportForm(props: FormProps) {
  const { onSubmit, onScrapeWebsite } = props

  const defaultValues: ImportFormValues = useMemo(() => getFormInitialValues(), [])

  const [processing, setProcessing] = useState(false)

  const {
    files,
    rejectedFiles,
    dropzoneUsed,
    textSize,
    textSizeLoading,
    fileToDelete,
    deleteDialogOpen,
    handleFileDrop,
    handleFileDelete,
    confirmFileDelete,
    setDeleteDialogOpen,
  } = useFileHandler(defaultValues?.files)

  const {
    urls,
    autoCrawl,
    deleteURLOpen,
    urlToDelete,
    confirmURLDelete,
    setAutoCrawl,
    handleURLDelete,
    setDeleteURLOpen,
  } = useUrlHandler(defaultValues?.urls)

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues,
    mode: 'onChange',
    shouldFocusError: false, // Prevents auto focusing on the first error, which can trigger error displays immediately.
  })

  const sumbitConfirmation = () => {
    if (deleteDialogOpen) {
      confirmFileDelete()
      setDeleteDialogOpen(false)
    } else {
      confirmURLDelete()
      setDeleteURLOpen(false)
    }
  }

  const { handleSubmit, control, formState, clearErrors } = form
  const { errors } = formState
  const newURL = form.getValues('newURL')

  // @ts-ignore - getting the error for the refined error type
  const filesOrUrlsError = errors?.filesOrUrls

  const onDrop = async (acceptedFiles: File[]) => {
    setProcessing(true)
    await handleFileDrop(acceptedFiles)
    setProcessing(false)
  }

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    // accept: ACCEPTED_FILE_REACT_DROPZONE,
    validator: formValidator,
    onDrop: onDrop,
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

  const onFormSumbit = async (data: ImportFormValues) => {
    setProcessing(true)
    await onSubmit(data)
    setProcessing(false)
  }

  const handleWebsiteScrape = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (onScrapeWebsite) {
      // const url = window.prompt('Enter a URL to scrape')
      // onScrapeWebsite('https://www.fuer-gruender.de/')
    }
  }

  useEffect(() => {
    if (dropzoneUsed) {
      form.setValue('files', files)
      form.trigger('files')

      if (files.length) {
        // @ts-ignore - getting the error for the refined error type
        clearErrors('filesOrUrls')
      }
    }

    if (newURL) {
      // @ts-ignore - getting the error for the refined error type
      clearErrors('filesOrUrls')
    }
  }, [files, form, dropzoneUsed, newURL, clearErrors])

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
          <Tabs defaultValue='urls'>
            <TabsList className='grid w-full grid-cols-2 relative'>
              <TabsTrigger value='urls'>URLs</TabsTrigger>
              <TabsTrigger value='files'>Files</TabsTrigger>
              {filesOrUrlsError && (
                <span className='text-[0.8rem] font-medium text-destructive absolute top-14 right-0'>
                  {filesOrUrlsError?.message}
                </span>
              )}
            </TabsList>
            <TabsContent value='files'>
              <div className='flex flex-col gap-4 mt-4'>
                <FormField
                  control={control}
                  name='files'
                  render={() => (
                    <FormItem className='relative'>
                      <FormLabel className={filesOrUrlsError && 'text-destructive'}>
                        Upload Files
                      </FormLabel>
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
                                Drop files or
                                <span className='underline text-neutral-500'>Click</span>
                                to browse
                              </p>
                              <p className='text-sm text-neutral-500'>
                                <span>Supported file types:</span> .pdf, .docx, .txt, .md,
                                .json, .jsonl, .csv
                              </p>
                            </>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DataSourceList
                  type={DataSourceType.file}
                  acceptedItems={files}
                  rejectedItems={rejectedFiles}
                  textSize={textSize}
                  textSizeLoading={textSizeLoading}
                  handleFileDelete={handleFileDelete}
                />
              </div>
            </TabsContent>
            <TabsContent value='urls'>
              <div className='flex flex-col gap-4 min-h-[184px] mt-4'>
                <div className='flex w-full flex-col items-start gap-4'>
                  <FormField
                    control={control}
                    name='newURL'
                    render={({ field }) => (
                      <FormItem className='w-full relative'>
                        <FormLabel className={filesOrUrlsError && 'text-destructive'}>
                          URL List
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter urls separated by coma (,)'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='absolute' />
                      </FormItem>
                    )}
                  />
                  <div className='flex items-center gap-4 mt-4'>
                    <Switch
                      id='autoCrawl'
                      // disabled={true}
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
                <DataSourceList
                  type={DataSourceType.web_page}
                  acceptedItems={urls}
                  textSize={textSize}
                  textSizeLoading={textSizeLoading}
                  handleFileDelete={handleURLDelete}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className='flex justify-between w-full'>
            <Button type='submit' size='lg' disabled={processing}>
              {processing && <IconSpinner className='mr-2' />}
              Import
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog
        open={deleteDialogOpen || deleteURLOpen}
        onOpenChange={deleteDialogOpen ? setDeleteDialogOpen : setDeleteURLOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the file and the associated data. The action cannot be
              undone and will permanently delete
              <b>
                {deleteDialogOpen ? fileToDelete?.file?.name : urlToDelete?.file?.name}
              </b>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={sumbitConfirmation}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
