'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { DataStoreForm, DataStoreFormValues } from '@/components/datastore/form'
import Typography from '@/components/typography'

import { createDataStoreApiCall, uploadFileApiCall } from '@/lib/api/dataStore'

interface DataStoreProps extends React.ComponentProps<'div'> {
  userId: string
  dataStore?: DataStoreExtended
}

export function CreateDataStore({ userId, dataStore }: DataStoreProps) {
  const [processing, setProcessing] = useState(false)
  const [ds, setDS] = useState(dataStore)

  const [files, setFiles] = useState<AcceptedFile[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([])

  const [dropzoneUsed, setDropzoneUsed] = useState(false)

  const [charCount, setCharCount] = useState(0)
  const [charCountLoading, setCharCountLoading] = useState(false)

  console.log(ds)

  const router = useRouter()

  const onSubmit = async (data: DataStoreFormValues) => {
    const { dataStoreName: name, dataStoreDescription: description, files } = data
    setProcessing(true)

    try {
      const dataStore = await createDataStoreApiCall({ userId, name, description })
      const dataStoreId = dataStore.id

      const fileUploadPromises = files.map(async ({ file }) => {
        return await uploadFileApiCall(file, dataStoreId)
      })

      const res = await Promise.all(fileUploadPromises)
      console.log(res)

      router.push('/datastore')
    } catch (err) {
      console.log(err)
      setProcessing(false)
    }
  }

  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <Typography variant='h2'>{ds ? 'Edit' : ' Create'} Knowledge Base</Typography>
      </div>
      <div className='max-w-lg w-full'>
        <DataStoreForm
          onSubmit={onSubmit}
          processing={processing}
          setFiles={setFiles}
          setRejectedFiles={setRejectedFiles}
          files={files}
          rejectedFiles={rejectedFiles}
          dropzoneUsed={dropzoneUsed}
          setDropzoneUsed={setDropzoneUsed}
          charCount={charCount}
          setCharCount={setCharCount}
          charCountLoading={charCountLoading}
          setCharCountLoading={setCharCountLoading}
        />
      </div>
    </div>
  )
}
