import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  StarIcon,
  MagnifyingGlassIcon,
  UploadIcon,
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import { Section } from '@/components/left-sidebar/section'
import { FilterIcon } from '@/components/ui/icons/custom'
import { Separator } from '@/components/ui/separator'

const mockFilters = [
  { name: 'All Items', url: '/history' },
  { name: 'First Filters', url: '/search' },
]
const mockCollections = [
  { name: 'Collection 1', url: '/import' },
  { name: 'UX Collection', url: '/datastore/create' },
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

      <div className='flex mt-[550px] flex-col px-2 items-stretch'>
        <Separator className='mb-2' />
        <Link
          href={'/search'}
          className={cn(
            SIDEBAR_BUTTON,
            pathname === FAVORITES_URL && ACTIVE_SIDEBAR_BUTTON,
          )}
        >
          <MagnifyingGlassIcon />
          Search
        </Link>
        <Link
          href={'/import'}
          className={cn(
            SIDEBAR_BUTTON,
            pathname === FAVORITES_URL && ACTIVE_SIDEBAR_BUTTON,
          )}
        >
          <UploadIcon />
          Import
        </Link>
      </div>
    </div>
  )
}
