import { createImageUpload } from 'novel/plugins'
import { toast } from 'sonner'

const onUpload = (file: File) => {
  console.log(2222, file)
  const uploadFileCall = fetch('/api/upload', {
    method: 'POST',
    headers: {
      'content-type': file?.type || 'application/octet-stream',
      'x-vercel-filename': file?.name || 'image.png',
    },
    body: file,
  })

  return new Promise((resolve) => {
    toast.promise(
      uploadFileCall.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as any

          // preload the image
          let image = new Image()
          image.src = url
          image.onload = () => {
            resolve(url)
          }
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file)
          throw new Error(
            '`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.',
          )
          // Unknown error
        } else {
          throw new Error(`Error uploading image. Please try again.`)
        }
      }),
      {
        loading: 'Uploading image...',
        success: 'Image uploaded successfully.',
        error: (e) => e.message,
      },
    )
  })
}

export const handleImageUpload = createImageUpload({
  onUpload,
  validateFn: (file: File) => {
    if (!file.type.includes('image/')) {
      toast.error('File type not supported.')
      return false
    }
    if (file.size / 1024 / 1024 > 10) {
      toast.error('File size too big (max 10MB).')
      return false
    }
    return true
  },
})
