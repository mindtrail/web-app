'use client'

import { useState } from 'react'
import { useChat, type Message } from 'ai/react'

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

import Typography from '@/components/typography'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  name?: string
  description?: string
}

export function Chat({ id, initialMessages, className, name, description }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null)
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

  const { messages, handleSubmit, reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    id,
    body: {
      chatId: id,
    },
  })

  return (
    <>
      <div
        className={cn(
          'w-full flex flex-col flex-1 items-center pb-[200px] pt-4 px-6 md:pt-12 md:px-8 gap-8',
          className,
        )}
      >
        <div className='flex flex-col items-center'>
          <Typography variant='h3'>{name} - Chat</Typography>
          <div className='flex gap-2 max-w-2xl w-full'>
            <Typography variant='p'>Flowise URL:</Typography>
            <input className='flex-1' />
          </div>
        </div>

        {messages?.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          // @ts-ignore
          <EmptyChat setInput={setInput} />
        )}
      </div>

      <ChatPanel
        isLoading={isLoading}
        stop={stop}
        handleSubmit={handleSubmit}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
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
