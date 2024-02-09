import { useCallback, useEffect, useState } from 'react'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { Button, buttonVariants } from '@/components/ui/button'

import { getCollectionsByUserId } from '@/lib/serverActions/collection'
// import { getFiltersByUserId } from '@/lib/serverActions/filter'

import { cn } from '@/lib/utils'

import { SecondSidebar } from '@/components/left-sidebar/second-sidebar'
import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

interface FolderProps {
  pathname: string
  secondSidebar?: SidebarFoldersProps
  setSecondSidebar: (value?: any) => void
}

export function Folders({ pathname, secondSidebar, setSecondSidebar }: FolderProps) {
  const [collections, setCollections] = useState<SidebarItem[]>([])
  const [secondSidebarOpen, setSecondSidebarOpen] = useState(!!secondSidebar)

  useEffect(() => {
    setSecondSidebarOpen(!!secondSidebar)
  }, [secondSidebar])

  useEffect(() => {
    getCollectionsData()
  }, [])

  const getCollectionsData = async () => {
    const items = await getCollectionsByUserId()
    if (Array.isArray(items)) {
      const collectionItems = items?.map((item) => {
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          url: `/folder/${item.id}`,
        }
      })
      setCollections(collectionItems)
    }
  }

  const handleFolderClick = useCallback(
    (item: any) => {
      const isCurrentItem = item?.name === secondSidebar?.name

      if (isCurrentItem) {
        return setSecondSidebarOpen(!secondSidebarOpen)
      }

      setSecondSidebar(item)
      setSecondSidebarOpen(true)
    },
    [secondSidebarOpen, secondSidebar, setSecondSidebar],
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
      <SecondSidebar
        secondSidebar={secondSidebar}
        setSecondSidebar={setSecondSidebar}
        items={collections}
        setItems={setCollections}
        open={secondSidebarOpen && secondSidebar !== undefined}
        setOpen={setSecondSidebarOpen}
        pathname={pathname}
      />
    </>
  )
}
