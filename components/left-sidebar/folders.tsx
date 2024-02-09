import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { SecondSidebar } from '@/components/left-sidebar/second-sidebar'

import { Button } from '@/components/ui/button'
import { IconMultipleFolders, IconTag } from '@/components/ui/icons/next-icons'

import { getCollectionsByUserId } from '@/lib/serverActions/collection'
import { getFiltersByUserId } from '@/lib/serverActions/filter'
import { SELECTED_ITEM } from '@/lib/constants'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

export function Folders() {
  const pathname = usePathname()

  const [title, setTitle] = useState('')
  const [secondSidebarOpen, setSecondSidebarOpen] = useState(false)
  const [selected, setSelected] = useState()
  const [collections, setCollections] = useState<SidebarItem[]>([])

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

  const [filters, setFilters] = useState<SidebarItem[]>([])

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

  const openSecondSidebar = (item: any) => {
    const isCurrentItem = item === selected
    if (isCurrentItem) {
      setSecondSidebarOpen(!secondSidebarOpen)
    }
    if (!secondSidebarOpen) {
      setSecondSidebarOpen(true)
    }
  }

  return (
    <>
      <div className='flex flex-col flex-1 gap-1 py-2'>
        <Button
          variant='sidebar'
          className={pathname.includes('folder') ? ACTIVE_BTN : ''}
          onClick={() => {
            setTitle('Folders')
            openSecondSidebar(SELECTED_ITEM.COLLECTIONS)
            setSelected(SELECTED_ITEM.COLLECTIONS)
          }}
        >
          <span className='flex flex-1 gap-4'>
            <IconMultipleFolders />
            Folders
          </span>

          <ChevronRightIcon className='mr-2' />
        </Button>
        <Button
          variant='sidebar'
          className={pathname.includes('tags') ? ACTIVE_BTN : ''}
          onClick={() => {
            setTitle('Tags')
            openSecondSidebar(SELECTED_ITEM.TAGS)
            setSelected(SELECTED_ITEM.TAGS)
          }}
        >
          <span className='flex flex-1 gap-4'>
            <IconTag />
            Tags
          </span>

          <ChevronRightIcon className='mr-2' />
        </Button>
      </div>
      <SecondSidebar
        title={title}
        items={selected === SELECTED_ITEM.COLLECTIONS ? collections : filters}
        setItems={selected === SELECTED_ITEM.COLLECTIONS ? setCollections : setFilters}
        open={secondSidebarOpen && selected !== undefined}
        setOpen={setSecondSidebarOpen}
        pathname={pathname}
        selected={selected}
      />
    </>
  )
}
