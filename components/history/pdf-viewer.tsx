import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import { usePDFWorker } from '@/lib/hooks/use-PDF-worker'

export function PDFViewer({ file }: { file: string }) {
  const workerUrl = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js'
  const pdfWorkerUrl = usePDFWorker(workerUrl)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  if (!file || !pdfWorkerUrl) {
    return null
  }

  return (
    <Worker workerUrl={pdfWorkerUrl}>
      {/* <div> */}
      <Viewer fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
      {/* </div> */}
    </Worker>
  )
}
