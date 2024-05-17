import { useCallback } from 'react'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

import { NestedSidebar } from '@/components/left-sidebar/nested-sidebar'
import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

interface FoldersListProps {
  activeNestedSidebar?: NestedSidebarItem
  nestedItemsByCategory?: NestedItemsByCategory
  setActiveNestedSidebar: (value?: any) => void
  setNestedItemsByCategory: (value: SetNestedItemByCat) => void
}

export function FoldersList(props: FoldersListProps) {
  const {
    activeNestedSidebar,
    nestedItemsByCategory,
    setActiveNestedSidebar,
    setNestedItemsByCategory,
  } = props

  const pathname = usePathname()

  const handleFolderClick = useCallback(
    (item: any) => {
      if (item?.name === activeNestedSidebar?.name) {
        return setActiveNestedSidebar(null)
      }

      setActiveNestedSidebar(item)
    },
    [activeNestedSidebar, setActiveNestedSidebar],
  )

  return (
    <>
      <div className='flex flex-col gap-1 py-2 mt-[2px]'>
        {Object.values(SIDEBAR_FOLDERS).map((item, index) => {
          const { name, url, icon: Icon } = item
          return (
            <Button
              key={index}
              variant='sidebar'
              className={pathname.includes(url) ? ACTIVE_BTN : ''}
              onClick={() => handleFolderClick(item)}
            >
              <span className='flex flex-1 gap-4'>
                <Icon className='w-5 h-5' />
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

        ${!!activeNestedSidebar ? 'w-[204px] opacity-100' : 'w-[0px]'}
      `}
      >
        {activeNestedSidebar && (
          <NestedSidebar
            pathname={pathname}
            activeNestedSidebar={activeNestedSidebar}
            nestedItemsByCategory={nestedItemsByCategory}
            setActiveNestedSidebar={setActiveNestedSidebar}
            setNestedItemsByCategory={setNestedItemsByCategory}
          />
        )}
      </div>
    </>
  )
}
