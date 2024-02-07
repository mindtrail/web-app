'use client'
import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  FileIcon,
} from '@radix-ui/react-icons'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'

interface SectionProps {
  items: any[]
  title: string
  iconOverride?: React.FC
}

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'sidebar' }))
const NESTED_ITEM_STYLE = cn(SIDEBAR_BUTTON, 'pl-8')
const ACTIVE_SIDEBAR_BUTTON = 'text-primary font-semibold hover:text-primary'
const TRIGGER_HEADER_STYLE = 'flex flex-1 justify-between px-4 gap-2 cursor-pointer'

<<<<<<< HEAD
export function Section({ title, items, iconOverride: Icon = FileIcon }: SectionProps) {
=======
export function Section({
  title,
  items,
  iconOverride: Icon = FileIcon,
  // @ts-ignore
  openSecondSidebar,
}: SectionProps) {
>>>>>>> dev
  const [sectionIsOpen, setSectionIsOpen] = useState(true)
  const pathname = usePathname()

  const onToggleSection = useCallback((value: string) => {
    setSectionIsOpen(!!value)
  }, [])

  const renderItems = useMemo(() => {
    return items.map(({ name, url }, index) => {
      return (
        <Link
          key={index + name}
          href={url}
          className={cn(NESTED_ITEM_STYLE, pathname === url && ACTIVE_SIDEBAR_BUTTON)}
        >
          <Icon />
          {!openSecondSidebar && name}
        </Link>
      )
    })
  }, [items, pathname, Icon, openSecondSidebar])

  return (
    <Accordion
      type='single'
      collapsible
      defaultValue={'filters'}
      onValueChange={onToggleSection}
    >
      <AccordionItem value='filters' className='border-none'>
        <AccordionTrigger asChild className='py-1'>
          <div className={TRIGGER_HEADER_STYLE}>
            <Button
              variant='sidebarSection'
              className='whitespace-nowrap overflow-hidden text-ellipsis'
            >
              {sectionIsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
              {title}
            </Button>
<<<<<<< HEAD
            <Button variant='sidebar' className='hover:bg-slate-200 -mr-4 shrink-0'>
=======
            <Button
              variant='sidebar'
              className='hover:bg-slate-200 -mr-4 shrink-0'
              onClick={(e) => {
                e.preventDefault()
              }}
            >
>>>>>>> dev
              <PlusIcon />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className='flex flex-col pb-0'>{renderItems}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
