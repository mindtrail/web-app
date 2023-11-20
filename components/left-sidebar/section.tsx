import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  PlusIcon,
  StarIcon,
} from '@radix-ui/react-icons'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { FilterIcon } from '@/components/ui/icons/custom'
import path from 'path'

interface SectionProps {
  items: any[]
  title: string
}

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'sidebar' }))
const NESTED_ITEM_STYLE = cn(SIDEBAR_BUTTON, 'pl-8')
const ACTIVE_SIDEBAR_BUTTON = 'text-primary font-semibold hover:text-primary'
const TRIGGER_HEADER_STYLE =
  'flex flex-1 justify-between px-4 gap-2 cursor-pointer'

export default function Section({ title, items }: SectionProps) {
  const [sectionIsOpen, setSectionIsOpen] = useState(true)
  const pathname = usePathname()

  const onToggleSection = useCallback((value: string) => {
    setSectionIsOpen(!!value)
  }, [])

  const renderItems = useMemo(() => {
    return items.map(({ name, url }, index) => {
      return (
        <Link
          key={index}
          href={url}
          className={cn(
            NESTED_ITEM_STYLE,
            pathname === url && ACTIVE_SIDEBAR_BUTTON,
          )}
        >
          <FilterIcon />
          {name}
        </Link>
      )
    })
  }, [items, pathname])

  console.log(renderItems)

  return (
    <Accordion
      type='single'
      collapsible
      defaultValue={'filters'}
      onValueChange={onToggleSection}
    >
      <AccordionItem value='filters' className='border-none'>
        <AccordionTrigger asChild className='py-2'>
          <div className={TRIGGER_HEADER_STYLE}>
            <Button variant='sidebarSection'>
              {sectionIsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
              {title}
            </Button>
            <Button variant='sidebar' className='hover:bg-slate-200 -mr-4'>
              <PlusIcon />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className='flex flex-col pb-0'>
          {renderItems}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
