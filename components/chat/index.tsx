'use client'

import { useState } from 'react'
import { useChat, type Message } from 'ai/react'

import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { EmptyChat } from '@/components/chat/empty-chat'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import LoadingDots from '@/components/loading-dots'
import { IconSpinner } from '@/components/ui/icons'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

// Register the plugins
registerPlugin(FilePondPluginImagePreview)
registerPlugin(FilePondPluginFileValidateType)

const ACCEPTED_FILE_TYPES = [
  'application/epub+zip',
  'application/json',
  'application/octet-stream',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/x-ndjson',
  'application/x-subrip',
  'application/octet-stream',
  'text/csv',
  'text/plain',
  'text/markdown',
]

const UPLOAD_ENDPOINT = '/api/upload'
const MAX_NR_OF_FILES = 30
const UPLOAD_LABEL = 'Drag and drop files or <span class="filepond--label-action">Browse</span>'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null)
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

  const [dataStore, setDataStore] = useState(null)
  const [files, setFiles] = useState([])
  const [isInitializing, setIsInitializing] = useState(true)

  const handleInit = () => {
    console.log('FilePond instance has initialised')
    setIsInitializing(false)
  }

  const handleUpdateFiles = (fileItems: any) => {
    console.log(fileItems)
    // Set current file objects to state
    setFiles(fileItems.map(async (fileItem: any) => fileItem.file))
  }

  const { messages, handleSubmit, reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    id,
    body: {
      id,
      previewToken,
    },
  })

  const renderUpperContent = () => {
    if (!dataStore) {
      return (
        <div className='max-w-2xl w-full h-32 relative'>
          <FilePond
            allowMultiple={true}
            credits={false}
            files={files}
            labelIdle={UPLOAD_LABEL}
            maxFiles={MAX_NR_OF_FILES}
            oninit={handleInit}
            onupdatefiles={handleUpdateFiles}
            server={UPLOAD_ENDPOINT}
            acceptedFileTypes={ACCEPTED_FILE_TYPES}
          ></FilePond>
          {isInitializing ? (
            <div className='flex w-full h-[76px] bg-muted justify-center items-center absolute top-0'>
              <IconSpinner className='mr-2 animate-spin' />{' '}
              <span className='text-muted-foreground'>Loading...</span>
            </div>
          ) : null}
        </div>
      )
    }

    if (messages.length) {
      return (
        <>
          <ChatList messages={messages} />
          <ChatScrollAnchor trackVisibility={isLoading} />
        </>
      )
    }

    // @ts-ignore
    return <EmptyChat setInput={setInput} />
  }

  return (
    <>
      <div
        className={cn(
          'flex flex-col flex-1 items-center pb-[200px] pt-4 px-6 md:pt-12 md:px-8 gap-8 w-full',
          className,
        )}
      >
        <h1 className='mb-2 text-lg font-semibold text-center'>Upload docs to begin</h1>
        {renderUpperContent()}
      </div>
      <ChatPanel
        isLoading={isLoading}
        stop={stop}
        handleSubmit={handleSubmit}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        notInitialised={!dataStore}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a href='https://platform.openai.com/signup/' className='underline'>
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview environments so that the
              open source community can test the app. The token will be saved to your browser&apos;s
              local storage under the name <code className='font-mono'>ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder='OpenAI API key'
            onChange={(e) => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className='items-center'>
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
