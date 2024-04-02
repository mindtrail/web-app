import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

interface PopoverSelectorProps {
  renderTrigger: () => React.ReactNode
  renderContent: () => React.ReactNode
  contentProps: any
}
// props: { open: () => void; close: () => void }

export const PopoverSelector = (props: PopoverSelectorProps) => {
  const { renderTrigger, renderContent, contentProps } = props
  const [open, setOpen] = useState(false)

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
      <PopoverContent {...contentProps}>{renderContent()}</PopoverContent>
    </Popover>
  )
}
