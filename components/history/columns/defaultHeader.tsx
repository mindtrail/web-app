import {
  ReaderIcon,
  Pencil2Icon,
  BookmarkIcon,
  CalendarIcon,
} from '@radix-ui/react-icons'

type HeaderIconKeys = 'summary' | 'description' | 'tags' | 'created'
type DefaultHeaderProps = {
  text: HeaderIconKeys
}

const HEADER_ICON_MAP: Record<HeaderIconKeys, typeof ReaderIcon> = {
  description: ReaderIcon,
  summary: Pencil2Icon,
  tags: BookmarkIcon,
  created: CalendarIcon,
}

export const DefaultHeader = ({ text }: DefaultHeaderProps) => {
  const Icon = HEADER_ICON_MAP[text] || ReaderIcon
  return (
    <div className='flex items-center gap-2 px-2'>
      <Icon /> <span className='capitalize'>{text}</span>
    </div>
  )
}
