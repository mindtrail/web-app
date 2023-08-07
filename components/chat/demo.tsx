'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { EmptyScreen } from '@/components/chat/empty-screen'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function ChatDemo({ id, initialMessages, className }: ChatProps) {
  const { messages, append, handleSubmit, reload, stop, isLoading, input, setInput } = useChat({
    initialMessages,
    id,
    body: {
      id,
    },
  })

  return (
    <>
      <div
        className={cn(
          'h-[600px] w-full relative pt-4 sm:rounded-lg border shadow-lg bg-background',
          className,
        )}
      >
        {messages.length ? (
          <div className='max-h-[460px] overflow-auto pt-2'>
            <ChatList messages={messages} />
          </div>
        ) : (
          // @ts-ignore
          <EmptyScreen setInput={setInput} demo />
        )}
        <div className='absolute bottom-[-0.5rem] w-full'>
          <ChatPanel
            demo
            isLoading={isLoading}
            stop={stop}
            handleSubmit={handleSubmit}
            reload={reload}
            messages={messages}
            input={input}
            setInput={setInput}
          />
        </div>
      </div>
    </>
  )
}
