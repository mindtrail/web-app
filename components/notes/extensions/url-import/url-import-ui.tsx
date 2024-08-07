import React, { useState } from 'react'
import { NodeViewWrapper, Node } from '@tiptap/react'

import { API } from '@/lib/api/mock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface URLImportUIProps {
  node: Node & { attrs: { url: string; result: string } }
  updateAttributes: (attributes: any) => void
}
export const URLImportUI = ({ node, updateAttributes }: URLImportUIProps) => {
  const [url, setUrl] = useState(node?.attrs?.url || '')
  const [loading, setLoading] = useState(false)

  const handleScrape = async () => {
    setLoading(true)
    try {
      const result = await API.scrapeURL(url)
      updateAttributes({ result })
    } catch (error) {
      console.error('Error scraping URL:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <NodeViewWrapper>
      <div className='flex flex-col space-y-2 p-4 border rounded-md'>
        <label className='font-medium'>Website URL</label>
        <div className='flex space-x-2'>
          <Input
            type='text'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='Enter URL'
          />
          <Button onClick={handleScrape} disabled={loading}>
            {loading ? 'Scraping...' : 'Scrape'}
          </Button>
        </div>
        {node.attrs.result && (
          <div className='px-4 py-2 bg-gray-50 rounded-md'>
            <p>{node.attrs.result}</p>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
