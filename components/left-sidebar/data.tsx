import Link from 'next/link'
import { PlusIcon } from '@radix-ui/react-icons'

import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

const TAG_BOARD_PATH = '/'
const HISTORY = '/history'

const LINK_STYLE = cn(
  buttonVariants({ variant: 'ghost', size: 'lg' }),
  'justify-start hover:bg-white px-4 rounded-none border-l-4 border-transparent',
)

const ACTIVE_LINK_STYLE = 'bg-white border-blue-500'

export default function DataHistory() {
  return (
    <>
      <div className='flex flex-col'>
        <Link href={TAG_BOARD_PATH} className={cn(LINK_STYLE)}>
          Tag Board
        </Link>

        <Link href={HISTORY} className={cn(LINK_STYLE)}>
          History
        </Link>
      </div>

      <Separator />

      <div className='flex flex-col'>
        <div className='flex justify-between items-center mb-2'>
          <Typography variant='small' className='text-gray-500 px-2'>
            Collections
          </Typography>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-slate-200'
            // onClick={}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
