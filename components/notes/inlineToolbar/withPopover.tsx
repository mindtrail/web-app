import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components//ui/popover'

interface WithPopoverProps {
  content: React.ReactNode
}

export function withPopover(WrappedComponent: React.ComponentType<any>) {
  return function ComponentWithPopover({ content, ...props }: WithPopoverProps) {
    const [open, setOpen] = useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <WrappedComponent {...props} />
        </PopoverTrigger>

        <PopoverContent sideOffset={5} className='PopoverContent'>
          {content}
        </PopoverContent>
      </Popover>
    )
  }
}
