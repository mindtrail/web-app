import Link from 'next/link'
import {
  PlusIcon,
  StarIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FileIcon,
} from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'

import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FilterIcon } from '@/components/ui/icons/custom'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { cn } from '@/lib/utils'

const TAG_BOARD_PATH = '/'
const HISTORY = '/history'

const LINK_STYLE = cn(
  buttonVariants({ variant: 'ghost', size: 'lg' }),
  'justify-start px-4 gap-2 hover:bg-muted/50',
)

const NESTED_ITEM_STYLE = cn(LINK_STYLE, 'pl-8')

const ACTIVE_LINK_STYLE = 'bg-muted hover:bg-muted text-foreground'

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
    <div className='flex flex-col text-foreground/70'>
      <div className='flex flex-col mx-2 items-stretch'>
        <Link
          href={TAG_BOARD_PATH}
          className={cn(
            LINK_STYLE,
            pathname === TAG_BOARD_PATH && ACTIVE_LINK_STYLE,
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
              <div className='flex-1 justify-between px-4 gap-2 cursor-pointer'>
                <span className='flex gap-2 items-center'>
                  {filtersOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  Filters
                </span>
                <Button variant='ghost' className='hover:bg-slate-200 -mr-4'>
                  <PlusIcon />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col pb-0'>
              <Link
                href={HISTORY}
                className={cn(
                  NESTED_ITEM_STYLE,
                  pathname === HISTORY && ACTIVE_LINK_STYLE,
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

      <Separator />

      <Accordion
        type='single'
        collapsible
        defaultValue={'collections'}
        onValueChange={onToggleCollections}
      >
        <AccordionItem value='collections' className='border-none'>
          <AccordionTrigger asChild className='py-2'>
            <div className='flex-1 justify-between px-4 gap-2 cursor-pointer'>
              <span className='flex gap-2 items-center'>
                {collectionsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                Collections
              </span>
              <Button variant='ghost' className='hover:bg-slate-200 -mr-4'>
                <PlusIcon />
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className='flex flex-col pb-0'>
            <Link href={HISTORY} className={cn(NESTED_ITEM_STYLE)}>
              <FileIcon />
              All Items
            </Link>
            <Link href={HISTORY} className={cn(NESTED_ITEM_STYLE)}>
              <FileIcon />
              First Filters
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
