import { ReaderIcon, BookmarkIcon, CalendarIcon } from '@radix-ui/react-icons'
import { COLUMN_LABELS } from '@/lib/constants'

type DefaultHeaderProps = {
  id: keyof typeof COLUMN_LABELS
}

const HEADER_ICON_MAP: Record<string, typeof ReaderIcon> = {
  createdAt: CalendarIcon,
  dataSourceTags: BookmarkIcon,
  description: ReaderIcon,
}

export const DefaultHeader = ({ id }: DefaultHeaderProps) => {
  const Icon = HEADER_ICON_MAP[id] || ReaderIcon
  return (
    <div className='flex items-center gap-2 px-2'>
      <Icon /> <span className='capitalize'>{COLUMN_LABELS[id]}</span>
    </div>
  )
}
