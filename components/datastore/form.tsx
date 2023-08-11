'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  ACCEPTED_FILE_REACT_DROPZONE,
  MAX_NR_OF_FILES,
  UPLOAD_ENDPOINT,
  METADATA_ENDPOINT,
  UPLOAD_LABEL,
} from '@/components/datastore/constants'

import { formatDate } from '@/lib/utils'

const dataStoreFormSchema = z.object({
  dataStore: z
    .string()
    .min(4, {
      message: 'DataStore must be at least 4 characters.',
    })
    .max(30, {
      message: 'DataStore must not be longer than 30 characters.',
    }),
  files: z.array(z.any()).min(1, {
    message: 'You must upload at least one valid file.',
  }),
})

const defaultStyles = 'border-neutral-300 bg-neutral-50'
const rejectStyles = 'border-red-400 bg-neutral-300 cursor-not-allowed text-neutral-800'
const acceptStyles = 'border-green-600 bg-green-50'

type DataStoreFormValues = z.infer<typeof dataStoreFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DataStoreFormValues> = {
  dataStore: `DataStore - ${formatDate(new Date())}`,
  files: [],
}

export function DataStoreForm() {
  const [files, setFiles] = useState<File[]>([])
  const [hasInteracted, setHasInteracted] = useState(false)

  const form = useForm<DataStoreFormValues>({
    resolver: zodResolver(dataStoreFormSchema),
    defaultValues,
    mode: 'onChange',
    shouldFocusError: false, // Prevents auto focusing on the first error, which can trigger error displays immediately.
  })

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_REACT_DROPZONE,
    onDrop: async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) {
        return
      }
      setHasInteracted(true) // User has interacted with the dropzone
      setFiles(files.concat(acceptedFiles))
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form

  console.log(errors)
  //   const {
  //     refineCore: { onFinish, formLoading },
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //     setValue,
  // } = useForm();

  function onSubmit(data: DataStoreFormValues) {
    // if (!acceptedFiles.length) {
    //   form.setError("files", {
    //     type: "manual",
    //     message: "You must upload at least one file.",
    //   });
    // } else {
    //   console.log(data, acceptedFiles);
    // }

    console.log(data)
  }

  useEffect(() => {
    if (hasInteracted) {
      form.setValue('files', files)
      form.trigger('files')
    }
  }, [files, form, hasInteracted])

  // @TODO: cache this
  const fileList = files.map((file: File) => <div key={file.name}>{file.name}</div>)

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={control}
          name='dataStore'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Create a Data Store</FormLabel>
              <FormDescription>Add your file here</FormDescription>
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
              <FormDescription>Drop files or click to browse.</FormDescription>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`flex flex-col w-full h-28 rounded-xl justify-center
                  border items-center gap-4 text-neutral-600
                  select-none cursor-default transition .25s ease-in-out
                  ${isDragReject ? rejectStyles : isDragAccept ? acceptStyles : defaultStyles}`}
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
        <div className='max-w-lg w-full flex-1 relative flex flex-col gap-8'>{fileList}</div>
        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  )
}
