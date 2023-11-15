import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/chat/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons/next-icons'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
    | 'handleSubmit'
  > {
  demo?: boolean
  notInitialised?: boolean
}

export function ChatPanel(props: ChatPanelProps) {
  const {
    demo,
    isLoading,
    stop,
    handleSubmit,
    reload,
    input,
    setInput,
    messages,
    notInitialised,
  } = props

  const positionStyles = demo ? '' : 'fixed'

  return (
    <div
      className={`${positionStyles} flex inset-x-0 bottom-0 bg-gradient-to-b
      from-muted/10 from-10% to-muted/30 to-50%`}
    >
      {demo ? null : <ButtonScrollToBottom />}
      {/* {demo ? null : <div className='spacer hidden md:flex md:w-[250px] lg:w-[300px]' />} */}

      <div className='flex-1 mx-auto sm:max-w-3xl sm:px-8'>
        <div className='flex h-10 items-center justify-center'>
          {isLoading ? (
            <Button
              variant='outline'
              onClick={() => stop()}
              className='bg-background'
            >
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
        <div className='space-y-4 px-4 py-2  sm:rounded-t-xl'>
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
