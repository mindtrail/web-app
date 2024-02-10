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
}

export function Folders(props: FolderProps) {
  const { pathname, nestedSidebar, itemListByCategory, setNestedSidebar } = props

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
      <NestedSidebar
        pathname={pathname}
        nestedSidebar={nestedSidebar}
        itemListByCategory={itemListByCategory}
        setNestedSidebar={setNestedSidebar}
      />
    </>
  )
}
