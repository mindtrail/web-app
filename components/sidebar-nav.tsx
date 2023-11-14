'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { PlusIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Typography from './typography'
import { Button } from '@/components/ui/button'

const sidebarItems = [
  {
    title: 'View 1',
    href: '/search',
  },
  {
    title: 'View 2',
    href: '/chat',
  },
  {
    title: 'View 3',
    href: '/import',
  },
]

const TAG_BOARD_PATH = '/'
const HISTORY = '/history'

const LINK_STYLE = cn(
  buttonVariants({ variant: 'ghost', size: 'lg' }),
  'justify-start hover:bg-white px-4 rounded-none border-l-4 border-transparent',
)

const ACTIVE_LINK_STYLE = 'bg-white border-blue-500'

type SidebarNavProps = {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col basis-[256px] bg-slate-100', className)}>
      <Link href='/' className='flex w-40 items-center gap-4 px-4'>
        <Image width={32} height={32} src='/icon-2.png' alt='Mind Trail' />
        Mind Trail
      </Link>

      <Separator />

      <div className='flex flex-col'>
        <Link
          href={TAG_BOARD_PATH}
          className={cn(
            LINK_STYLE,
            pathname === TAG_BOARD_PATH && ACTIVE_LINK_STYLE,
          )}
        >
          Tag Board
        </Link>

        <Link
          href={HISTORY}
          className={cn(LINK_STYLE, pathname === HISTORY && ACTIVE_LINK_STYLE)}
        >
          History
        </Link>
      </div>

      <Separator />

      <div className='flex flex-col'>
        <div className='flex justify-between items-center mb-2'>
          <Typography variant='small' className='text-gray-500 px-2'>
            Views
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

        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              LINK_STYLE,
              pathname === item.href && ACTIVE_LINK_STYLE,
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
