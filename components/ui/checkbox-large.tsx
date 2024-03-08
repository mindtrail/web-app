'use client'

import { Checkbox, type CheckboxProps } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type CheckboxLargeProps = CheckboxProps & {
  className?: string
  checkboxClassName?: string
}

export const CheckboxLarge = (props: CheckboxLargeProps) => {
  const { className, checkboxClassName, ...rest } = props

  return (
    <label
      className={cn(
        'flex items-center justify-center w-12 h-12 p-4 cursor-pointer',
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox className={checkboxClassName} {...rest} />
    </label>
  )
}
