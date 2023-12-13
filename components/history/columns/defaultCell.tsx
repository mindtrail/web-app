import { Typography } from '@/components/typography'

type DefaultCellProps = {
  text: string
}

export const DefaultCell = ({ text }: DefaultCellProps) => {
  return (
    <div className='flex items-center gap-2 px-2'>
      <Typography className='line-clamp-5'>{text || 'No data'}</Typography>
    </div>
  )
}
