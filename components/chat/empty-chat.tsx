import { UseChatHelpers, type Message } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const demoMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`,
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article:',
  },
  {
    heading: 'Draft an email',
    message: `Draft an email about the following:`,
  },
]

const InfoMessage = {
  default: '',
  demo: '',
}

interface EmptyChat {
  setInput: Pick<UseChatHelpers, 'setInput'>
  exampleMessages?: []
  demo?: boolean
  title?: string
}

export function EmptyChat({ setInput, exampleMessages, title }: EmptyChat) {
  const messagesToDisplay = exampleMessages?.length ? exampleMessages : demoMessages
  return (
    <div className='mx-auto w-full max-w-2xl p-8 sm:rounded-lg'>
      <h1 className='mb-2 text-lg font-semibold'>{title}</h1>
      <p className='leading-normal text-muted-foreground'>Start a conversation here:</p>
      <div className='mt-4 flex flex-col items-start space-y-2'>
        {/* {messagesToDisplay.map((message, index) => (
          <Button
            key={index}
            variant='link'
            className='h-auto p-0 text-base'
            // @ts-ignore
            onClick={() => setInput(message.message)}
          >
            <IconArrowRight className='mr-2 text-muted-foreground' />
            {message.heading}
          </Button>
        ))} */}
      </div>
    </div>
  )
}
