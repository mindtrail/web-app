import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/chat/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons/next-icons'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    'isLoading' | 'reload' | 'messages' | 'stop' | 'input' | 'setInput' | 'handleSubmit'
  > {
  notInitialised?: boolean
}

export function ChatPanel(props: ChatPanelProps) {
  const {
    isLoading,
    stop,
    handleSubmit,
    reload,
    input,
    setInput,
    messages,
    notInitialised,
  } = props

  return (
    <div
      className={`absolute flex inset-x-0 bottom-0 bg-gradient-to-b
        from-muted/10 from-10% to-muted/30 to-50%
      `}
    >
      {<ButtonScrollToBottom />}
      <div className='w-full '>
        <div className='flex h-10 items-center justify-center'>
          {isLoading ? (
            <Button variant='outline' onClick={() => stop()} className='bg-background'>
              <IconStop className='mr-2' />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant='outline'
                onClick={() => reload()}
                className='bg-background'
              >
                <IconRefresh className='mr-2' />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className='space-y-4 pt-2'>
          <PromptForm
            onSubmit={handleSubmit}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            notInitialised={notInitialised}
          />
        </div>
      </div>
    </div>
  )
}
