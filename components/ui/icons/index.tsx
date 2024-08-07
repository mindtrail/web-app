import { memo } from 'react'
import { icons } from 'lucide-react'
import * as CustomIcons from './custom'
import * as NextIcons from './next-icons'

import { cn } from '@/lib/utils'

export type IconProps = {
  name: keyof typeof icons | keyof typeof CustomIcons | keyof typeof NextIcons
  className?: string
  strokeWidth?: number
}

export const Icon = memo(({ name, className, strokeWidth }: IconProps) => {
  // console.log(11111, icons, CustomIcons, NextIcons)
  const IconComponent =
    icons[name as keyof typeof icons] ||
    CustomIcons[name as keyof typeof CustomIcons] ||
    NextIcons[name as keyof typeof NextIcons]

  if (!IconComponent) {
    return null
  }

  return <IconComponent className={cn('w-4 h-4', className)} strokeWidth={strokeWidth} />
})

Icon.displayName = 'Icon'
