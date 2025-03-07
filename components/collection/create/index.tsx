'use client'

import { useRouter } from 'next/navigation'
import { DataSourceStatus } from '@prisma/client'

import { Typography } from '@/components/typography'
import { CollectionForm } from '@/components/collection/create/form'
import { CollectionFormValues } from '@/components/collection/utils'
import { useToast } from '@/components/ui/use-toast'
import { useGlobalState } from '@/context/global-state'

import { scrapeURLs } from '@/lib/serverActions/dataSource'

import { uploadFileApiCall } from '@/lib/api/dataSource'
import { createCollectionApiCall, updateCollectionApiCall } from '@/lib/api/collection'

interface CollectionProps extends React.ComponentProps<'div'> {
  userId: string
  collection?: CollectionExtended
}

export function CreateCollection({
  userId,
  collection: existingCollection,
}: CollectionProps) {
  const [values, dispatch] = useGlobalState()

  console.log(values)
  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (data: CollectionFormValues) => {
    const actionType = existingCollection ? 'updated' : 'created'
    const functionToCall = existingCollection ? updateCollection : createCollection

    try {
      await functionToCall(data)

      // router.push('/search?refresh=true')
    } catch (err) {
      console.error(err)

      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong. ${data?.name} was not ${actionType} properly`,
      })
    }
  }

  const onScrapeWebsite = async (url: string) => {
    const res = await fetch(`/api/scraper?urls=${url}`)
    const data = await res.json()
  }

  const createCollection = async (data: CollectionFormValues) => {
    const { name, description, files, newURL } = data
    const dsPayload = { userId, name, description }

    const newCollection = await createCollectionApiCall(dsPayload)
    const collectionId = newCollection.id

    if (newURL) {
      // @TODO: If I will add https:// automatically, it should be done here
      const urlList = newURL.split(',').map((url) => url.trim())
      scrapeURLs(urlList, collectionId)
    }

    if (files?.length) {
      await uploadFiles(files, newCollection.id)
    }

    dispatch({
      type: 'ADD_UNSYNCED_DATA_STORE',
      payload: { id: collectionId },
    })

    toast({
      title: 'Knowledge Base created',
      description: `${name} has been created`,
    })

    return { id: collectionId }
  }

  const updateCollection = async (data: CollectionFormValues) => {
    if (!existingCollection) {
      return
    }

    const { name, description, files, urls, newURL } = data
    const {
      id: collectionId,
      name: existingName,
      description: existingDescription,
    } = existingCollection

    const unsynchedFiles = files?.filter(
      ({ status }) => status === DataSourceStatus.unsynched,
    )

    // We only add the name and description if they are different from the existing ones
    const dsPayload = { userId } as Partial<CreateCollection>
    if (name !== existingName) {
      dsPayload.name = name
    }
    if (description !== existingDescription) {
      dsPayload.description = description
    }

    // We only update the collection if there are changes
    if (dsPayload.name || dsPayload.description) {
      await updateCollectionApiCall(collectionId, dsPayload)
    }

    if (newURL) {
      // @TODO: If I will add https:// automatically, it should be done here
      const urlList = newURL.split(',').map((url) => url.trim())
      scrapeURLs(urlList, collectionId)
    }
    // We only upload files if there are changes
    if (unsynchedFiles?.length) {
      await uploadFiles(unsynchedFiles, collectionId)
    }

    // Those are the only async operations
    if (urls?.length || unsynchedFiles?.length) {
      dispatch({
        type: 'ADD_UNSYNCED_DATA_STORE',
        payload: { id: collectionId },
      })
    }

    toast({
      title: 'Knowledge Base updated',
      description: `${name} has been updated`,
    })
  }

  const uploadFiles = async (files: AcceptedFile[], collectionId: string) => {
    const fileUploadPromises = files.map(async ({ file }) => {
      return await uploadFileApiCall(file as File)
    })
    const res = await Promise.allSettled(fileUploadPromises)
    return res
  }

  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <Typography variant='h2'>
          {existingCollection ? 'Edit' : ' Create'} Knowledge Base
        </Typography>
      </div>
      <div className='max-w-xl w-full'>
        <CollectionForm
          onSubmit={onSubmit}
          existingCollection={existingCollection}
          onScrapeWebsite={onScrapeWebsite}
        />
      </div>
    </div>
  )
}
