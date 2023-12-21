import { useState, useCallback } from 'react'
import { DataSourceStatus, DataSource } from '@prisma/client'

import { useToast } from '@/components/ui/use-toast'
import { MAX_NR_OF_FILES } from '@/components/collection/constants'
import {
  getFileMetadataApiCall,
  deleteDataSourceApiCall,
} from '@/lib/api/dataSource'

import {
  filterFiles,
  updateFilesWithMetadata,
} from '@/components/collection/utils'

const getFilesMetadata = async (files: AcceptedFile[]) => {
  const metadataPromises = files.map(async ({ file }) => {
    const droppedFile = file as File
    return await getFileMetadataApiCall(droppedFile)
  })
  return await Promise.all(metadataPromises)
}

export function useFileHandler(initialFiles: AcceptedFile[] = []) {
  const { toast } = useToast()

  const [files, setFiles] = useState<AcceptedFile[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([])
  const [textSizeLoading, setTextSizeLoading] = useState(false)
  const [dropzoneUsed, setDropzoneUsed] = useState(false)
  const [textSize, setTextSize] = useState(0)
  const [fileToDelete, setFileToDelete] = useState<AcceptedFile | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleFileDrop = useCallback(
    async (droppedFiles: File[]) => {
      if (!droppedFiles.length) {
        return
      }

      const existingFiles = files?.length || 0

      const remainingSlots = MAX_NR_OF_FILES - existingFiles
      // Filter files based on size and nr limit
      let { acceptedFiles, rejectedFiles } = filterFiles(
        droppedFiles,
        remainingSlots,
      )

      setFiles((prevFiles = []) => [...prevFiles, ...acceptedFiles])
      setRejectedFiles(rejectedFiles)
      setTextSizeLoading(true)
      setDropzoneUsed(true) // User has interacted with the dropzone
      try {
        const metadataForFiles = (await getFilesMetadata(
          acceptedFiles,
        )) as Metadata[]

        const totalChars = metadataForFiles.reduce(
          (acc, { textSize }) => acc + textSize,
          0,
        )

        setFiles((prevFiles) =>
          updateFilesWithMetadata(prevFiles, metadataForFiles),
        )
        setTextSize((prevChars) => prevChars + totalChars)
        setTextSizeLoading(false)
      } catch (error) {
        console.log(error)
      }
    },
    [files?.length],
  )

  const handleFileDelete: DeleteHandler = useCallback((event, file) => {
    event.preventDefault()
    if (!file) {
      return
    }
    if (file.status === DataSourceStatus.synched) {
      setFileToDelete(file)
      setDeleteDialogOpen(true)
      return
    }

    filterOutDeletedFileAndUpdateTextSize(file)
  }, [])

  const filterOutDeletedFileAndUpdateTextSize = (
    fileToDelete: AcceptedFile,
  ) => {
    const { file, textSize = 0, status } = fileToDelete

    setFiles((prevFiles) =>
      prevFiles.filter(({ file: prevFile }) => {
        return prevFile.name !== file.name
      }),
    )
    setTextSize((prevChars) => prevChars - textSize)
  }

  const confirmFileDelete = useCallback(async () => {
    if (!fileToDelete) {
      return
    }

    try {
      const { id, name } = fileToDelete.file as DataSource
      await deleteDataSourceApiCall(id)

      toast({
        title: 'File deleted',
        description: `${name} has been deleted`,
      })
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${name}`,
      })
      console.log(err)
    }

    filterOutDeletedFileAndUpdateTextSize(fileToDelete)
  }, [fileToDelete, toast])

  return {
    files,
    rejectedFiles,
    textSizeLoading,
    textSize,
    dropzoneUsed,
    fileToDelete,
    deleteDialogOpen,
    handleFileDrop,
    handleFileDelete,
    confirmFileDelete,
    setDeleteDialogOpen,
  }
}
