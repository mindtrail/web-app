import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

interface PopoverSelectorProps {
  renderTrigger: () => React.ReactNode
  renderContent: (closeModal: () => void) => React.ReactNode
  contentProps: any
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export const PopoverSelector = (props: PopoverSelectorProps) => {
  const {
    renderTrigger,
    renderContent,
    contentProps,
    isOpen: externalIsOpen = false,
    onOpenChange: externalOnOpenChange,
  } = props

  console.log(222, externalIsOpen)
  const [isOpen, setIsOpen] = useState(externalIsOpen)
  const onOpenChange = externalOnOpenChange || setIsOpen

  return (
    <Popover modal={true} open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
      <PopoverContent {...contentProps}>
        {renderContent(() => setIsOpen(false))}
      </PopoverContent>
    </Popover>
  )
}
