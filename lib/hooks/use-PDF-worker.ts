import { useState, useEffect } from 'react'

// Custom hook to load the worker script only once
export const usePDFWorker = (workerUrl: string) => {
  const [isWorkerLoaded, setIsWorkerLoaded] = useState(false)

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
