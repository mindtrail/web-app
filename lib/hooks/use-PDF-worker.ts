import { useState, useEffect } from 'react'

// Custom hook to load the worker script only once
export const usePDFWorker = (workerUrl: string) => {
  const [isWorkerLoaded, setIsWorkerLoaded] = useState(false)

  // if (typeof window !== 'undefined') {
  //   window.addEventListener('unhandledrejection', function (event) {
  //     if (
  //       event.reason &&
  //       event.reason.message.includes(
  //         'The reference does not point to a /Page dictionary.',
  //       )
  //     ) {
  //       console.log('Caught an unhandled exception related to PDF.js:')
  //       setIsWorkerLoaded(false)
  //       // Handle the error or log it
  //     }
  //   })
  // }

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && !window.pdfjsWorkerLoaded) {
      // @ts-ignore
      window.pdfjsWorkerLoaded = true // Set a flag on the window object
      setIsWorkerLoaded(true)
    }
  }, [])

  return isWorkerLoaded ? workerUrl : null
}
