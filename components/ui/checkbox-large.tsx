'use client'

import { Checkbox, type CheckboxProps } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type CheckboxLargeProps = CheckboxProps & {
  className?: string
  checkboxClassName?: string
}

const CheckboxLarge = ({
  className,
  checkboxClassName,
  ...props
}: CheckboxLargeProps) => (
  <label
    className={cn(
      'flex items-center justify-center w-12 h-12 p-4 cursor-pointer',
      className,
    )}
    onClick={(e) => e.stopPropagation()}
  >
    <Checkbox className={checkboxClassName} {...props} />
  </label>
)

export { CheckboxLarge }
