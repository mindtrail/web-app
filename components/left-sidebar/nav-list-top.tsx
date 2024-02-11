import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

import { TOP_SIDEBAR_ITEMS } from '@/components/left-sidebar/constants'

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

interface NavListTopProps {
  setActiveNestedSidebar: (value?: any) => void
}

export function NavListTop({ setActiveNestedSidebar }: NavListTopProps) {
  const pathname = usePathname()

  return (
    <div className='flex flex-col py-2 gap-1 '>
      {TOP_SIDEBAR_ITEMS.map(({ name, url, icon: Icon }) => (
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
