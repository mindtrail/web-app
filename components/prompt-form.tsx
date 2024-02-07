import { useEffect, useRef, FormEvent } from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IconArrowElbow } from '@/components/ui/icons/next-icons'

export interface PromptProps extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  isLoading: boolean
  notInitialised?: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  notInitialised,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <div className='relative flex w-full grow flex-col overflow-hidden bg-background px-6 sm:rounded-t-md sm:border sm:px-8'>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Send a message.'
          spellCheck={false}
          className='min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] focus-within:outline-none sm:text-sm'
        />
        <div className='absolute right-0 top-4 sm:right-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='submit'
                size='icon'
                disabled={isLoading || input === '' || notInitialised}
              >
                <IconArrowElbow />
                <span className='sr-only'>Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
