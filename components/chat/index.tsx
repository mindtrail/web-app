'use client'
import { useState } from 'react'
import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { EmptyChat } from '@/components/chat/empty-chat'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import Typography from '@/components/typography'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  name?: string
  description?: string
  flowiseURLEnvVar?: string
  userId?: string
}

export function Chat(props: ChatProps) {
  const { id, initialMessages, className, name, flowiseURLEnvVar, userId } =
    props

  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null,
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const [flowiseURL, setFlowiseURL] = useState(flowiseURLEnvVar)
  const [flowiseEnabled, setFlowiseEnabled] = useState(false)

  const chatProps = {
    initialMessages,
    id,
    body: {
      chatId: id,
    },
  }

  console.log(chatProps)
  const { messages, handleSubmit, reload, stop, isLoading, input, setInput } =
    useChat(chatProps)

  return (
    <>
      <div
        className={cn(
          'w-full flex flex-col flex-1 mb-[200px] pt-4 px-6 md:pt-8 md:px-8 md:py-8 gap-4',
          className,
        )}
      >
        <div className='flex flex-col w-full gap-2'>
          <Typography variant='h4' className='mb-4 text-gray-700'>
            Chat
          </Typography>
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
              <a
                href='https://platform.openai.com/signup/'
                className='underline'
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className='font-mono'>ai-token</code>.
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
