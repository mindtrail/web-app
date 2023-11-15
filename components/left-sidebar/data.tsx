import Link from 'next/link'
import {
  PlusIcon,
  StarIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'

import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FilterIcon } from '@/components/ui/icons/mindtrail'

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
  'justify-start px-4 gap-2 hover-bg-muted',
)

const NESTED_ITEM_STYLE = cn(LINK_STYLE, 'pl-8')

const ACTIVE_LINK_STYLE = 'bg-muted hover:bg-muted text-foreground'

export default function DataHistory() {
  const pathname = usePathname()

  const [filtersOpen, setFiltersOpen] = useState(true)

  const onChange = useCallback((value: string) => {
    setFiltersOpen(!!value)
  }, [])

  return (
    <div className='flex flex-col gap-2 text-secondary-foreground'>
      <div className='flex flex-col mx-2 gap-2 items-stretch'>
        <Link
          href={TAG_BOARD_PATH}
          className={cn(
            LINK_STYLE,
            pathname === TAG_BOARD_PATH && ACTIVE_LINK_STYLE,
            'hover:bg-muted/50',
          )}
        >
          <StarIcon />
          Favorites
        </Link>

        <Accordion
          type='single'
          collapsible
          defaultValue={'filters'}
          onValueChange={onChange}
        >
          <AccordionItem value='filters' className='border-none'>
            <AccordionTrigger asChild>
              <div className={cn(LINK_STYLE, 'flex-1 justify-between')}>
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

      <div className='flex flex-col'>
        <div className='flex justify-between items-center mb-2'>
          <Typography
            variant='small'
            className='text-secondary-foreground px-2'
          >
            Collections
          </Typography>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-slate-200'
            // onClick={}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
