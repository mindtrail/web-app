import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

// import { usePDFWorker } from '@/lib/hooks/use-PDF-worker'
import { useEffect } from 'react'

const workerUrl = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js'

export function PDFViewer({ file }: { file: string }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  // const pdfWorkerUrl = usePDFWorker(workerUrl)

  useEffect(() => {
    function cathcError(event: any) {
      console.log('Caught an unhandled exception related to PDF.js:')
    }

    window.addEventListener('unhandledrejection', cathcError)
    return window.removeEventListener('unhandledrejection', cathcError)
  }, [])

  if (!file) {
    return <p>Loading...</p>
  }

  return (
    <Worker workerUrl={workerUrl}>
      <Viewer
        renderError={() => <p>Error</p>}
        fileUrl={file}
        plugins={[defaultLayoutPluginInstance]}
      />
    </Worker>
  )
}
