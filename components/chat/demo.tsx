'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { EmptyChat } from '@/components/chat/empty-chat'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { ChatProps } from '@/components/chat'

const DEMO_API = '/api/demo-chat'

export function ChatDemo({ id, initialMessages, className }: ChatProps) {
  const { messages, append, handleSubmit, reload, stop, isLoading, input, setInput } = useChat({
    api: DEMO_API,
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
          'h-[600px] w-full max-w-4xl relative pt-4 sm:rounded-lg border shadow-lg bg-background',
          className,
        )}
      >
        {messages.length ? (
          <div className='max-h-[460px] overflow-auto pt-2'>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </div>
        ) : (
          // @ts-ignore
          <EmptyChat setInput={setInput} title='Demo - Welcome to the AI Chatbot!' />
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
