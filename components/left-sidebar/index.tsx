'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FolderItems from '@/components/left-sidebar/folders'
import { usePathname } from 'next/navigation'
import { getCollectionsByUserId } from '@/lib/serverActions/collection'
import { getFiltersByUserId } from '@/lib/serverActions/filter'
import { SecondSidebar } from './second-sidebar'
import LeftSidebarFooter from './left-sidebar-footer'
import { SELECTED_ITEM } from '@/lib/constants'

type SidebarNavProps = {
  className?: string
  user: any
}

const BRAND_NAME = 'Mind Trail'

export function LeftSidebar({ className, user }: SidebarNavProps) {
  const [openSecondSidebar, setOpenSecondSidebar] = useState(false)
  const [title, setTitle] = useState('')
  const pathname = usePathname()
  // const [loading, setLoading] = useState(false)

  const [collections, setCollections] = useState<SidebarItem[]>([])
  const [filters, setFilters] = useState<SidebarItem[]>([])

  const [selected, setSelected] = useState(undefined)
  const [subSelected, setSubSelected] = useState(undefined)

  useEffect(() => {
    getCollectionsData()
    // TO-DO: Smart Folders v1
    //getFiltersData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getFiltersData = async () => {
    // setLoading(true)
    const items = await getFiltersByUserId()
    if (Array.isArray(items)) {
      const filterItems = items?.map((item) => {
        return {
          id: item.id,
          name: item.name,
          criteria: item.criteria,
        }
      })
      setFilters(filterItems)
    }
    // setLoading(false)
  }

  const getCollectionsData = async () => {
    // setLoading(true)
    const items = await getCollectionsByUserId()
    if (Array.isArray(items)) {
      const collectionItems = items?.map((item) => {
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          url: `/collection/${item.id}`,
        }
      })
      setCollections(collectionItems)
    }
    // setLoading(false)
  }

  return (
    <div className='min-h-screen flex relative'>
      {/* Container for both sidebars and main content */}
      <div className={`flex ${className}`}>
        {/* First sidebar */}
        <nav className='flex flex-col justify-between w-[256px] border-r flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out h-screen'>
          <div>
            <div className='h-14 border-b flex items-center justify-center'>
              <Link
                href='/'
                className='flex gap-4 w-full px-6 py-2 self-center items-center'
              >
                <Image width={30} height={30} src='/icon-2.png' alt='Mind Trail' />
                {BRAND_NAME}
              </Link>
            </div>

            <FolderItems
              openSecondSidebar={openSecondSidebar}
              setOpenSecondSidebar={setOpenSecondSidebar}
              setTitle={setTitle}
              filters={filters}
              setSelected={setSelected}
              selected={selected}
              subSelected={subSelected}
              setSubSelected={setSubSelected}
            />
          </div>
          <div className='p-4 border-t border-gray-200'>
            <LeftSidebarFooter user={user} />
          </div>
        </nav>
        <SecondSidebar
          title={title}
          items={selected === SELECTED_ITEM.COLLECTIONS ? collections : filters}
          setItems={selected === SELECTED_ITEM.COLLECTIONS ? setCollections : setFilters}
          open={openSecondSidebar && selected !== undefined}
          setOpen={setOpenSecondSidebar}
          pathname={pathname}
          selected={selected}
          setSubSelected={setSubSelected}
        />
      </div>
    </div>
  )
}
