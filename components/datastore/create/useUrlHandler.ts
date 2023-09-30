import { useState, useCallback } from 'react'

export function useUrlHandler(initialUrls: URLScrapped[] = []) {
  const [urls, setUrls] = useState(initialUrls)
  const [autoCrawl, setAutoCrawl] = useState(true)

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

  return {
    urls,
    autoCrawl,
    handleUrlSubmit,
    setAutoCrawl,
  }
}
