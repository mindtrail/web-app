import { useCallback, useEffect, useState } from 'react'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { Button, buttonVariants } from '@/components/ui/button'

import { getCollectionsByUserId } from '@/lib/serverActions/collection'
// import { getFiltersByUserId } from '@/lib/serverActions/filter'

import { cn } from '@/lib/utils'

import { NestedSidebar } from '@/components/left-sidebar/nested-sidebar'
import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

interface FolderProps {
  pathname: string
  nestedSidebar?: NestedSidebarProps
  itemListByCategory?: ItemListByCategory
  setNestedSidebar: (value?: any) => void
  setItemListByCategory: (value: ItemListByCategory) => void
}

export function Folders(props: FolderProps) {
  const {
    pathname,
    nestedSidebar,
    itemListByCategory,
    setNestedSidebar,
    setItemListByCategory,
  } = props

  const handleFolderClick = useCallback(
    (item: any) => {
      const toggleCurrentItem = item?.name === nestedSidebar?.name

      if (toggleCurrentItem) {
        return setNestedSidebar()
      }

      setNestedSidebar(item)
    },
    [nestedSidebar, setNestedSidebar],
  )

  return (
    <>
      <div className='flex flex-col flex-1 gap-1 py-2'>
        {Object.values(SIDEBAR_FOLDERS).map((item, index) => {
          const { name, url, icon: Icon } = item
          return (
            <Button
              key={index}
              variant='sidebar'
              className={pathname.includes(url) ? ACTIVE_BTN : ''}
              onClick={() => handleFolderClick(item)}>
              <span className='flex flex-1 gap-4'>
                <Icon />
                {name}
              </span>

              <ChevronRightIcon className='mr-2' />
            </Button>
          )
        })}
      </div>
      <div
        className={`absolute top-0 left-12 ml-1 h-full flex flex-col
        bg-background overflow-hidden shadow-md opacity-0 group
        transition-all duration-3 ease-in-out

        ${!!nestedSidebar ? 'w-[204px] opacity-100' : 'w-[0px]'}
      `}>
        {nestedSidebar && (
          <NestedSidebar
            pathname={pathname}
            nestedSidebar={nestedSidebar}
            itemListByCategory={itemListByCategory}
            setNestedSidebar={setNestedSidebar}
            setItemListByCategory={setItemListByCategory}
          />
        )}
      </div>
    </>
  )
}
