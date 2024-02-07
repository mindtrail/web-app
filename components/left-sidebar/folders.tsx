'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import {
  IconAllData,
  IconChevronRight,
  IconFolders,
  IconHighlight,
  IconIdea,
  IconTag,
} from '../ui/icons/next-icons'
import { SELECTED_ITEM } from '@/lib/constants'

const mockCollections = [
  { name: 'Collection 1', url: '/' },
  { name: 'UX Collection', url: '/collection/create' },
]

const FAVORITES_URL = '/'
const ALLITEMS_URL = '/history'

const SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'sidebar' }))
const OPEN_SIDEBAR_BUTTON = cn(buttonVariants({ variant: 'opensidebar' }))
const ACTIVE_SIDEBAR_BUTTON = 'text-primary font-semibold hover:text-primary'
const TRIGGER_HEADER_STYLE = 'flex flex-1 justify-between pl-3 gap-2 cursor-pointer'
const NAV_ITEM_STYLE = 'flex flex-col pl-2 py-2 items-stretch'

const OPENSIDEBAR_NAVITEM_STYLE = 'pl-2 cursor-pointer text-center'
const NAV_ITEM_CONTENT_STYLE = 'flex flex-1 gap-2'

type SidebarFoldersProps = {
  setOpenSecondSidebar: (value: boolean) => void
  openSecondSidebar: boolean
  setTitle: (value: string) => void
  loading: boolean
  filters: any
  setSelected: (value: any) => void
  selected: any
  subSelected: any
  setSubSelected: (value: any) => void
}

// @ts-ignore
export default function FolderItems({
  setOpenSecondSidebar,
  openSecondSidebar,
  setTitle,
  loading,
  setSelected,
  selected,
  subSelected,
  setSubSelected,
}: SidebarFoldersProps) {
  const pathname = usePathname()

  const [filteredCollections, setFilteredCollections] =
    useState<{ name: string; url: string }[]>(mockCollections)

  const openSecondSidebarFn = (item: any) => {
    const isCurrentItem = item === selected
    if (isCurrentItem) {
      setOpenSecondSidebar(!openSecondSidebar)
    }
    if (!openSecondSidebar) {
      setOpenSecondSidebar(true)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col ml-1 items-stretch mt-2'>
        <Link
          href={ALLITEMS_URL}
          className={cn(
            SIDEBAR_BUTTON,
            pathname === FAVORITES_URL && ACTIVE_SIDEBAR_BUTTON,
          )}
          onClick={() => {
            setSelected(undefined)
            setSubSelected(undefined)
            setOpenSecondSidebar(false)
          }}
        >
          <div className='flex flex-1 gap-4'>
            <IconAllData />
            All Items
          </div>
        </Link>
      </div>
      <Separator className='mb-2 mt-2' />
      <div className={NAV_ITEM_STYLE}>
        <div className={TRIGGER_HEADER_STYLE}>
          <Button
            variant='sidebarSection'
            className={`w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis ${
              subSelected === SELECTED_ITEM.FILTERS && 'bg-[#f3f4f6]'
            }`}
            onClick={() => {
              setTitle('Smart Folders')
              openSecondSidebarFn(SELECTED_ITEM.FILTERS)
              setSelected(SELECTED_ITEM.FILTERS)
            }}
          >
            <div className='flex justify-between w-full'>
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconIdea />
                <span className='ml-2'>Smart Folders</span>
              </div>

              <div className='flex items-center'>
                <IconChevronRight />
              </div>
            </div>
          </Button>
        </div>
      </div>

      <div className={NAV_ITEM_STYLE}>
        <div className={TRIGGER_HEADER_STYLE}>
          <Button
            variant='sidebarSection'
            className={`w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis ${
              subSelected === SELECTED_ITEM.COLLECTIONS && 'bg-[#f3f4f6]'
            }`}
            onClick={() => {
              setTitle('Folders')
              openSecondSidebarFn(SELECTED_ITEM.COLLECTIONS)
              setSelected(SELECTED_ITEM.COLLECTIONS)
            }}
          >
            <div className='flex justify-between w-full'>
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconFolders />
                <span className='ml-2'>Folders</span>
              </div>

              <div className='flex items-center'>
                <IconChevronRight />
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div className={NAV_ITEM_STYLE}>
        <div className={TRIGGER_HEADER_STYLE}>
          <Button
            variant='sidebarSection'
            className={`w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis ${
              subSelected === SELECTED_ITEM.TAGS && 'bg-[#f3f4f6]'
            }`}
            onClick={() => {
              setTitle('Tags')
              openSecondSidebarFn(SELECTED_ITEM.TAGS)
              setSelected(SELECTED_ITEM.TAGS)
            }}
          >
            <div className='flex justify-between w-full'>
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconTag />
                <span className='ml-2'>Tags</span>
              </div>

              <div className='flex items-center'>
                <IconChevronRight />
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div className={NAV_ITEM_STYLE}>
        <div className={TRIGGER_HEADER_STYLE}>
          <Button
            variant='sidebarSection'
            className={`w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis ${
              subSelected === SELECTED_ITEM.HIGHLIHTS && 'bg-[#f3f4f6]'
            }`}
            onClick={() => {
              setTitle('Highlits')
              setSelected(SELECTED_ITEM.HIGHLIHTS)
            }}
          >
            <div className='flex justify-between w-full'>
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconHighlight />
                <span className='ml-2'>Highlits</span>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
