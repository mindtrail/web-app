import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { StarIcon, TokensIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

import { buttonVariants } from '@/components/ui/button'
import { Section } from '@/components/left-sidebar/section'

const mockFilters = [{ name: 'UX Research', url: '/import' }]
const mockCollections = [{ name: 'Group 1', url: '/search' }]

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

        <Section title='AI Groups' items={mockFilters} iconOverride={TokensIcon} />
      </div>

      <div className='flex flex-col px-2 items-stretch'>
        <Section
          title='Manual Groups'
          items={mockCollections}
          iconOverride={TokensIcon}
        />
      </div>
    </div>
  )
}
