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
    title: 'History',
    href: '/history',
  },
  {
    title: 'Search',
    href: '/search',
  },
  {
    title: 'Chat',
    href: '/chat',
  },
  {
    title: 'Import',
    href: '/import',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
]

const TAG_BOARD_PATH = 'tag-board'

export function SidebarNav() {
  const pathname = usePathname()

  return (
    // <nav className='flex-1 mt-4 pr-2 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1'>
    <nav className='flex-1 mt-4 pr-2 flex space-x-2 flex-col space-y-1'>
      <Link
        href={TAG_BOARD_PATH}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          pathname === TAG_BOARD_PATH
            ? 'bg-muted hover:bg-muted'
            : 'hover:bg-transparent hover:underline',
          'justify-start',
        )}
      >
        Tag Board
      </Link>

      <Typography variant='small' className='text-gray-500'>
        Views
      </Typography>

      {sidebarItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
