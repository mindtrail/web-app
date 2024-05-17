import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

interface NavItemListProps {
  list: SidebarNavItem[]
  pathname: string
  setActiveNestedSidebar: (value?: any) => void
}

export function NavItemList(props: NavItemListProps) {
  const { list, pathname, setActiveNestedSidebar } = props

  if (!list?.length) {
    return null
  }

  return (
    <div className='flex flex-col py-2 gap-1 '>
      {list?.map(({ name, url, icon: Icon }) => (
        <Link
          key={url}
          href={url}
          className={cn(SIDEBAR_BTN, pathname === url && ACTIVE_BTN)}
          onClick={() => setActiveNestedSidebar()}
        >
          <Icon className='w-5 h-5' />
          {name}
        </Link>
      ))}
    </div>
  )
}
