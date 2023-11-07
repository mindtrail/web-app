'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Typography from './typography'

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
  {
    title: 'View 4',
    href: '/settings',
  },
]

const TAG_BOARD_PATH = '/'
const HISTORY = '/history'

const LINK_STYLE = cn(
  buttonVariants({ variant: 'ghost', size: 'lg' }),
  'justify-start hover:bg-white px-4 rounded-none border-l-4 border-transparent',
)

const ACTIVE_LINK_STYLE = 'bg-white border-blue-500'

export function SidebarNav() {
  const pathname = usePathname()

  return (
    // <nav className='flex-1 mt-4 pr-2 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1'>
    <nav className='flex-1 flex flex-col bg-slate-100 py-4'>
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

      <Typography variant='small' className='text-gray-500 mt-8 mb-4 px-2'>
        Views
      </Typography>

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
    </nav>
  )
}
