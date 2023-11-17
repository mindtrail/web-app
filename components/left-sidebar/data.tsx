import { useCallback, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  PlusIcon,
  StarIcon,
} from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { FilterIcon } from '@/components/ui/icons/custom'

const TAG_BOARD_PATH = '/'
const HISTORY = '/history'

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'sidebar' }))

const NESTED_ITEM_STYLE = cn(SIDEBAR_BUTTON, 'pl-8')
const ACTIVE_SIDEBAR_BUTTON = 'border-input text-foreground'
const TRIGGER_HEADER_STYLE =
  'flex flex-1 justify-between px-4 gap-2 cursor-pointer'

export default function DataHistory() {
  const pathname = usePathname()

  const [filtersOpen, setFiltersOpen] = useState(true)
  const [collectionsOpen, setCollectionsOpen] = useState(true)

  const onToggleFilters = useCallback((value: string) => {
    setFiltersOpen(!!value)
  }, [])
  const onToggleCollections = useCallback((value: string) => {
    setCollectionsOpen(!!value)
  }, [])

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col mx-2 items-stretch'>
        <Link
          href={TAG_BOARD_PATH}
          className={cn(
            SIDEBAR_BUTTON,
            pathname === TAG_BOARD_PATH && ACTIVE_SIDEBAR_BUTTON,
          )}
        >
          <StarIcon />
          Favorites
        </Link>

        <Accordion
          type='single'
          collapsible
          defaultValue={'filters'}
          onValueChange={onToggleFilters}
        >
          <AccordionItem value='filters' className='border-none'>
            <AccordionTrigger asChild className='py-2'>
              <div className={TRIGGER_HEADER_STYLE}>
                <Button variant='sidebarSection'>
                  {filtersOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  Filters
                </Button>
                <Button variant='sidebar' className='hover:bg-slate-200 -mr-4'>
                  <PlusIcon />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col pb-0'>
              <Link
                href={HISTORY}
                className={cn(
                  NESTED_ITEM_STYLE,
                  pathname === HISTORY && ACTIVE_SIDEBAR_BUTTON,
                )}
              >
                <FilterIcon />
                All Items
              </Link>
              <Link href={HISTORY} className={cn(NESTED_ITEM_STYLE)}>
                <FilterIcon />
                First Filters
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className='flex flex-col px-2 items-stretch'>
        <Accordion
          type='single'
          collapsible
          defaultValue={'collections'}
          onValueChange={onToggleCollections}
        >
          <AccordionItem value='collections' className='border-none'>
            <AccordionTrigger asChild className='py-2'>
              <div className={TRIGGER_HEADER_STYLE}>
                <Button variant='sidebarSection'>
                  {collectionsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  Collections
                </Button>
                <Button variant='sidebar' className='hover:bg-slate-200 -mr-4'>
                  <PlusIcon />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col pb-0'>
              <Link href={HISTORY} className={cn(NESTED_ITEM_STYLE)}>
                <FileIcon />
                Collection 1
              </Link>
              <Link href={HISTORY} className={cn(NESTED_ITEM_STYLE)}>
                <FileIcon />
                UX Collection
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
