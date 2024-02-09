import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { IconAllData, IconHighlight } from '@/components/ui/icons/next-icons'

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

const topSectionItems = [
  { name: 'All Items', url: '/all-items', icon: IconAllData },
  { name: 'Highlights', url: '/highlights', icon: IconHighlight },
]

export function TopSection() {
  const pathname = usePathname()

  return (
    <div className='flex flex-col py-2 gap-1 '>
      {topSectionItems.map(({ name, url, icon: Icon }) => (
        <Link
          key={url}
          href={url}
          className={cn(SIDEBAR_BTN, pathname === url && ACTIVE_BTN)}
        >
          <Icon />
          {name}
        </Link>
      ))}
    </div>
  )
}
