import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { StarIcon, FileIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import { Section } from '@/components/left-sidebar/section'
import { FilterIcon } from '@/components/ui/icons/custom'

const mockFilters = [
  { id: '1', name: 'All Items', url: '/history' },
  { id: '2', name: 'First Filters', url: '/search' },
]
const mockCollections = [
  { id: '1', name: 'Collection 1', url: '/import' },
  { id: '2', name: 'UX Collection', url: '/datastore/create' },
]

const FAVORITES_URL = '/'
const SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_SIDEBAR_BUTTON = 'text-primary font-semibold hover:text-primary'

export default function ResearchHistory() {
  const pathname = usePathname()
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col mx-2 items-stretch'>
        <Link
          href={FAVORITES_URL}
          className={cn(
            SIDEBAR_BUTTON,
            pathname === FAVORITES_URL && ACTIVE_SIDEBAR_BUTTON,
          )}
        >
          <StarIcon />
          Favorites
        </Link>

        <Section
          title='Filters'
          items={mockFilters}
          iconOverride={FilterIcon}
        />
      </div>

      <div className='flex flex-col px-2 items-stretch'>
        <Section title='Collections' items={mockCollections} />
      </div>
    </div>
  )
}
