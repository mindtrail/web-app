import Link from 'next/link'
import {
  PlusIcon,
  StarIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import { useCallback, MouseEventHandler } from 'react'

import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FilterIcon } from '@/components/ui/icons/mindtrail'

import { cn } from '@/lib/utils'

const TAG_BOARD_PATH = '/'
const HISTORY = '/history'

const LINK_STYLE = cn(
  buttonVariants({ variant: 'ghost', size: 'lg' }),
  'justify-start px-4 gap-2 hover:underline hover:bg-transparent rounded-8',
)

const ACTIVE_LINK_STYLE = 'bg-muted hover:bg-muted'

export default function DataHistory() {
  const pathname = usePathname()

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col mx-2 gap-2 items-start'>
        <Link
          href={TAG_BOARD_PATH}
          className={cn(
            LINK_STYLE,
            pathname === TAG_BOARD_PATH && ACTIVE_LINK_STYLE,
          )}
        >
          <StarIcon />
          Favorites
        </Link>

        <div className='flex w-full group justify-between'>
          <Button variant='ghost' className='flex-1 justify-between'>
            <span className='flex gap-2 items-center'>
              <ChevronRightIcon />
              Filters
            </span>
            <Button
              variant='ghost'
              className='invisible group-hover:visible hover:bg-slate-200/50 -mr-4'
            >
              <PlusIcon />
            </Button>
          </Button>
        </div>
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
    </div>
  )
}
