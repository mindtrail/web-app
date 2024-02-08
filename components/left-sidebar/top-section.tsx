import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import { IconAllData, IconHighlight } from '@/components/ui/icons/next-icons'

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_SIDEBAR_BUTTON = 'text-primary font-semibold hover:text-primary'

type TopSectionProps = {
  filters: any
}

const topSectionItems = [
  { name: 'All Items', url: '/all-items', icon: IconAllData },
  { name: 'Highlights', url: '/highlights', icon: IconHighlight },
]

export function TopSection({}: TopSectionProps) {
  const pathname = usePathname()

  // const [filteredCollections, setFilteredCollections] =
  //   useState<{ name: string; url: string }[]>(mockCollections)

  return (
    <div className='flex flex-col py-2 gap-1'>
      {topSectionItems.map(({ name, url, icon: Icon }) => (
        <Link
          key={url}
          href={url}
          className={cn(SIDEBAR_BUTTON, pathname === url && ACTIVE_SIDEBAR_BUTTON)}
        >
          <div className='flex flex-1 gap-4 items-center '>
            <Icon />
            {name}
          </div>
        </Link>
      ))}
    </div>
  )
}
