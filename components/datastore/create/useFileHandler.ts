import { useState, useCallback } from 'react'
import { DataSrcStatus, DataSrc } from '@prisma/client'

import { useToast } from '@/components/ui/use-toast'
import { MAX_NR_OF_FILES } from '@/components/datastore/constants'
import {
  filterFiles,
  updateFilesWithMetadata,
} from '@/components/datastore/utils'

import { getFileMetadataApiCall, deleteFileApiCall } from '@/lib/api/dataStore'


const getFilesMetadata = async (files: AcceptedFile[]) => {
  const metadataPromises = files.map(async ({ file }) => {
    const droppedFile = file as File
    return await getFileMetadataApiCall(droppedFile)
  })
  return await Promise.all(metadataPromises)
}

export function useFileHandler(initialFiles: AcceptedFile[] = []) {
  const { toast } = useToast()

  const [files, setFiles] = useState(initialFiles)
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([])
  const [charCountLoading, setCharCountLoading] = useState(false)
  const [dropzoneUsed, setDropzoneUsed] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [fileToDelete, setFileToDelete] = useState<AcceptedFile | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleFileDrop = useCallback(
    async (droppedFiles: File[]) => {
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
    },
    [files?.length, getFilesMetadata],
  )

  const handleFileDelete: DeleteHandler = useCallback((event, file) => {
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
  }, [])

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

  const confirmFileDelete = useCallback(async () => {
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
  }, [fileToDelete, toast])

  return {
    files,
    rejectedFiles,
    charCountLoading,
    charCount,
    dropzoneUsed,
    fileToDelete,
    deleteDialogOpen,
    handleFileDrop,
    handleFileDelete,
    confirmFileDelete,
    setDeleteDialogOpen,
  }
}
