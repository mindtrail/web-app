'use client'

import { Checkbox, type CheckboxProps } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type CheckboxWithLabelProps = CheckboxProps & {
  className?: string
  checkboxClassName?: string
}

const CheckboxWithLabel = ({
  className,
  checkboxClassName,
  ...props
}: CheckboxWithLabelProps) => (
  <label className={cn('', className)} onClick={(e) => e.stopPropagation()}>
    <Checkbox className={checkboxClassName} {...props} />
  </label>
)

export { CheckboxWithLabel }
