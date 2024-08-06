import { DragEvent, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { API } from '@/lib/api/mock'
import { Editor } from '@tiptap/react'

interface FileUploadUIProps {
  getPos: () => number
  editor: Editor
}

const IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
]

export const useUploader = ({ getPos, editor }: FileUploadUIProps) => {
  const [loading, setLoading] = useState(false)

  const uploadFile = useCallback(async (file?: File) => {
    setLoading(true)

    const { type: fileType = '', name: fileName = '' } = file || {}
    try {
      if (IMAGE_CONTENT_TYPES.includes(fileType)) {
        const url = await API.uploadImage()

        // If image is uploaded, set the image viewer node
        if (url) {
          editor
            .chain()
            .setImageViewer({ src: url })
            .deleteRange({ from: getPos(), to: getPos() })
            .focus()
            .run()
        }
      } else {
        // If other file type is uploaded, set the file viewer node
        editor
          .chain()
          .setFileViewer({ src: fileName, fileName, fileType })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run()
      }
    } catch (errPayload: any) {
      const error = errPayload?.response?.data?.error || 'Something went wrong'
      toast.error(error)
    }
    setLoading(false)
  }, [])

  return { loading, uploadFile }
}

export const useFileUpload = () => {
  const fileInput = useRef<HTMLInputElement>(null)

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click()
  }, [])

  return { ref: fileInput, handleUploadClick }
}

export const useDropZone = ({ uploader }: { uploader: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [draggedInside, setDraggedInside] = useState<boolean>(false)

  useEffect(() => {
    const dragStartHandler = () => {
      setIsDragging(true)
    }

    const dragEndHandler = () => {
      setIsDragging(false)
    }

    document.body.addEventListener('dragstart', dragStartHandler)
    document.body.addEventListener('dragend', dragEndHandler)

    return () => {
      document.body.removeEventListener('dragstart', dragStartHandler)
      document.body.removeEventListener('dragend', dragEndHandler)
    }
  }, [])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      setDraggedInside(false)
      if (e.dataTransfer.files.length === 0) {
        return
      }

      const fileList = e.dataTransfer.files

      const files: File[] = []

      for (let i = 0; i < fileList.length; i += 1) {
        const item = fileList.item(i)
        if (item) {
          files.push(item)
        }
      }

      if (files.some((file) => file.type.indexOf('image') === -1)) {
        return
      }

      e.preventDefault()

      const filteredFiles = files.filter((f) => f.type.indexOf('image') !== -1)

      const file = filteredFiles.length > 0 ? filteredFiles[0] : undefined

      if (file) {
        uploader(file)
      }
    },
    [uploader],
  )

  const onDragEnter = () => {
    setDraggedInside(true)
  }

  const onDragLeave = () => {
    setDraggedInside(false)
  }

  return { isDragging, draggedInside, onDragEnter, onDragLeave, onDrop }
}
