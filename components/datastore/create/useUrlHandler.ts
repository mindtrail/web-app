import { useState, useCallback } from 'react'
import { DataSrc } from '@prisma/client'
import { deleteFileApiCall } from '@/lib/api/dataStore'
import { useToast } from '@/components/ui/use-toast'

export function useUrlHandler(initialUrls: URLScrapped[] = []) {
  const [urls, setUrls] = useState(initialUrls)
  const [autoCrawl, setAutoCrawl] = useState(true)
  const [urlToDelete, setUrlToDelete] = useState<URLScrapped | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { toast } = useToast()

  const handleUrlSubmit = useCallback(async (url: URLScrapped) => {
    try {
      // if (onScrapeWebsite) {
      //   await onScrapeWebsite(url)
      // }
      console.log('--- urls ---', url)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const toggleAutoCrawl = useCallback(() => {
    setAutoCrawl((prevAutoCrawl) => !prevAutoCrawl)
  }, [])

  const handleURLDelete: DeleteHandler = useCallback((event, file) => {
    event.preventDefault()
    console.log('file', file)

    if (!file) {
      return
    }

    setUrlToDelete(file as URLScrapped)
    setDeleteDialogOpen(true)
  }, [])

  const confirmURLDelete = useCallback(async () => {
    if (!urlToDelete) {
      return
    }

    try {
      const { id, name } = urlToDelete.file as DataSrc
      const deleteResult = await deleteFileApiCall(id)

      toast({
        title: 'Webpage deleted',
        description: `${name} has been deleted`,
      })
      console.log(deleteResult)
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${name}`,
      })
      console.log(err)
    }

    filterOutDeletedURLs(urlToDelete)
  }, [urlToDelete, toast])

  const filterOutDeletedURLs = (fileToDelete: URLScrapped) => {
    const { file } = fileToDelete

    setUrls((prevURLs) =>
      prevURLs.filter(({ file: prevFile }) => {
        return prevFile.id !== file.id
      }),
    )
  }

  return {
    urls,
    autoCrawl,
    urlToDelete,
    deleteURLOpen: deleteDialogOpen,
    handleUrlSubmit,
    setAutoCrawl,
    handleURLDelete,
    confirmURLDelete,
    setDeleteURLOpen: setDeleteDialogOpen,
  }
}
