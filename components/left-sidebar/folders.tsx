import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { SecondSidebar } from '@/components/left-sidebar/second-sidebar'

import { Button } from '@/components/ui/button'
import { IconMultipleFolders, IconTag } from '@/components/ui/icons/next-icons'

import { getCollectionsByUserId } from '@/lib/serverActions/collection'
import { getFiltersByUserId } from '@/lib/serverActions/filter'
import { SELECTED_ITEM } from '@/lib/constants'

const TRIGGER_HEADER_STYLE = 'flex flex-1 justify-between pl-3 gap-2 cursor-pointer'
const NAV_ITEM_STYLE = 'flex flex-col pl-2 py-2 items-stretch'

const NAV_ITEM_CONTENT_STYLE = 'flex flex-1 gap-2'

export function Folders() {
  // items={selected === SELECTED_ITEM.COLLECTIONS ? collections : filters}
  // setItems={selected === SELECTED_ITEM.COLLECTIONS ? setCollections : setFilters}

  const pathname = usePathname()

  // console.log(pathname.split('/')[1])

  const [secondSidebarOpen, setSecondSidebarOpen] = useState(false)
  const [title, setTitle] = useState('')

  const [selected, setSelected] = useState()
  const [subSelected, setSubSelected] = useState()
  const [collections, setCollections] = useState<SidebarItem[]>([])

  useEffect(() => {
    getCollectionsData()
    // TO-DO: Smart Folders v1
    //getFiltersData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className='flex flex-col flex-1 '>
      <div className={NAV_ITEM_STYLE}>
        <div className={TRIGGER_HEADER_STYLE}>
          <Button
            variant='sidebarSection'
            className={`w-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis ${
              subSelected === SELECTED_ITEM.COLLECTIONS && 'bg-[#f3f4f6]'
            }`}
            onClick={() => {
              setTitle('Folders')
              openSecondSidebar(SELECTED_ITEM.COLLECTIONS)
              setSelected(SELECTED_ITEM.COLLECTIONS)
            }}
          >
            <div className='flex justify-between w-full'>
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconMultipleFolders />
                <span className='ml-2'>Folders</span>
              </div>

              <div className='flex items-center'>
                <ChevronRightIcon />
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
              openSecondSidebar(SELECTED_ITEM.TAGS)
              setSelected(SELECTED_ITEM.TAGS)
            }}
          >
            <div className='flex justify-between w-full'>
              <div className={NAV_ITEM_CONTENT_STYLE}>
                <IconTag />
                <span className='ml-2'>Tags</span>
              </div>

              <div className='flex items-center'>
                <ChevronRightIcon />
              </div>
            </div>
          </Button>
        </div>
      </div>

      <SecondSidebar
        title={title}
        items={selected === SELECTED_ITEM.COLLECTIONS ? collections : filters}
        setItems={selected === SELECTED_ITEM.COLLECTIONS ? setCollections : setFilters}
        open={secondSidebarOpen && selected !== undefined}
        setOpen={setSecondSidebarOpen}
        pathname={pathname}
        selected={selected}
        setSubSelected={setSubSelected}
      />
    </div>
  )
}
