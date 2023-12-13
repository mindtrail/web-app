import { ReaderIcon } from '@radix-ui/react-icons'

import { Typography } from '@/components/typography'

export const DescriptionHeader = () => (
  <div className='flex items-center gap-2 px-2'>
    <ReaderIcon /> Description
  </div>
)

type DescriptionCellProps = {
  description: string
}

export const DescriptionCell = ({ description }: DescriptionCellProps) => {
  return (
    <div className='flex items-center gap-2 px-2'>
      <Typography className='line-clamp-5'>
        {description || 'No description'}
      </Typography>
    </div>
  )
}
