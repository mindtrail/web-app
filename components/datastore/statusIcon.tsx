import { DataSourceStatus } from '@prisma/client'
import { useMemo } from 'react'

interface StatusIcon {
  status?: DataSourceStatus
  size?: 'sm' | 'md' | 'lg'
}

const colorMap = {
  [DataSourceStatus.unsynched]: 'bg-gray-500',
  [DataSourceStatus.synched]: 'bg-green-500',
  [DataSourceStatus.error]: 'bg-red-500',
  [DataSourceStatus.running]: 'bg-yellow-500',
  [DataSourceStatus.pending]: 'bg-gray-900',
  [DataSourceStatus.usage_limit_reached]: 'bg-gray-800',
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
