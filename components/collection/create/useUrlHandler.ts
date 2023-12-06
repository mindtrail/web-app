import { useState, useCallback } from 'react'
import { DataSrc } from '@prisma/client'
import { deleteDataSourceApiCall } from '@/lib/api/dataSource'
import { useToast } from '@/components/ui/use-toast'

export function useUrlHandler(initialUrls: URLScrapped[] = []) {
  const [urls, setUrls] = useState<URLScrapped[]>([])
  const [autoCrawl, setAutoCrawl] = useState(true)
  const [urlToDelete, setUrlToDelete] = useState<URLScrapped | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { toast } = useToast()

  const handleUrlSubmit = useCallback(async (url: URLScrapped) => {
    try {
      // if (onScrapeWebsite) {
      //   await onScrapeWebsite(url)
      // }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleURLDelete: DeleteHandler = useCallback((event, file) => {
    event.preventDefault()
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
      await deleteDataSourceApiCall(id)

      toast({
        title: 'Webpage deleted',
        description: `${name} has been deleted`,
      })
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${name}`,
      })
      console.error(err)
    }

    filterOutDeletedURLs(urlToDelete)
  }, [urlToDelete, toast])

  const filterOutDeletedURLs = (fileToDelete: URLScrapped) => {
    const { file } = fileToDelete

    setUrls((prevURLs) =>
      prevURLs.filter(({ file: prevFile }) => {
        return prevFile?.id !== file.id
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
