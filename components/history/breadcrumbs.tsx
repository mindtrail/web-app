import {
  Share2Icon,
  CaretSortIcon,
  DotsHorizontalIcon,
  ListBulletIcon,
  GridIcon,
} from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

export function HistoryBreadcrumbs() {
  return (
    <div className='flex justify-between items-center'>
      All Items
      <div>
        <Button size='sm' variant='ghost'>
          <CaretSortIcon className='h-5 w-5' />
          A-Z
        </Button>
        <Button size='sm' variant='ghost'>
          <ListBulletIcon className='h-5 w-5' />
        </Button>
        <Button size='sm' variant='ghost'>
          <Share2Icon className='h-5 w-5' />
        </Button>
      </div>
    </div>
  )
}
