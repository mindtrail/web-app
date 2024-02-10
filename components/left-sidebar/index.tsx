'use client'

import { useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'

import { LeftSidebarFooter } from '@/components/left-sidebar/footer'
import { Folders } from '@/components/left-sidebar/folders'
import { TopSection } from '@/components/left-sidebar/sidebar-top'
import { APP_NAME, SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

import { getCollectionsByUserId } from '@/lib/serverActions/collection'
// import { getFiltersByUserId } from '@/lib/serverActions/filter'

type SidebarNavProps = {
  className?: string
  user: any
}

export function LeftSidebar({ user }: SidebarNavProps) {
  const pathname = usePathname()
  const [nestedSidebar, setNestedSidebar] = useState<NestedSidebarProps | undefined>()
  const [itemListByCategory, setItemListByCategory] = useState<ItemListByCategory>()

  useEffect(() => {
    const subpath = pathname.split('/')[1]
    const openedSidebar = SIDEBAR_FOLDERS[subpath]

    setNestedSidebar(openedSidebar)
  }, [pathname])

  useEffect(() => {
    getCollectionsList()
    getTagsList()
  }, [])

  const getCollectionsList = async () => {
    const items = await getCollectionsByUserId()

    if (Array.isArray(items)) {
      setItemListByCategory((prev) => {
        return {
          ...prev,
          folder: items,
        }
      })
    }
  }

  const getTagsList = async () => {
    const items = await getCollectionsByUserId()

    if (Array.isArray(items)) {
      const newArr = items.splice(5, 7)
      console.log(newArr)
      setItemListByCategory((prev) => {
        return {
          ...prev,
          tag: newArr,
        }
      })
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <nav
        className='flex flex-col flex-1 justify-between w-[256px] flex-shrink-0
            border-r overflow-hidden transition-all duration-300 ease-in-out h-screen'>
        <div className='h-14 border-b flex items-center justify-center'>
          <Link href='/' className='flex gap-4 w-full px-4 py-2 self-center items-center'>
            <Image width={30} height={30} src='/icon-2.png' alt='Mind Trail' />
            {APP_NAME}
          </Link>
        </div>

        <div className='flex-1 flex flex-col relative'>
          <TopSection setNestedSidebar={setNestedSidebar} />
          <Separator />
          <Folders
            pathname={pathname}
            nestedSidebar={nestedSidebar}
            itemListByCategory={itemListByCategory}
            setNestedSidebar={setNestedSidebar}
            setItemListByCategory={setItemListByCategory}
          />
        </div>
        <div className='p-4 border-t'>
          <ThemeToggle />
          <LeftSidebarFooter user={user} />
        </div>
      </nav>
    </div>
  )
}
