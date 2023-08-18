import { DataSrcStatus } from '@prisma/client'
import { useMemo } from 'react'

interface StatusIcon {
  status?: DataSrcStatus
  size?: 'sm' | 'md' | 'lg'
}

const colorMap = {
  [DataSrcStatus.unsynched]: 'bg-gray-500',
  [DataSrcStatus.synched]: 'bg-green-500',
  [DataSrcStatus.error]: 'bg-red-500',
  [DataSrcStatus.running]: 'bg-yellow-500',
  [DataSrcStatus.pending]: 'bg-gray-900',
  [DataSrcStatus.usage_limit_reached]: 'bg-gray-800',
}

export function StatusIcon(props: StatusIcon) {
  const { status, size = 'sm' } = props

  const color = useMemo(() => {
    return !status ? 'bg-gray-500' : colorMap[status]
  }, [status])

  const sizeProp = useMemo(() => {
    return size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
  }, [size])

  return <span className={`flex rounded-full ${sizeProp} ${color}`} />
}
