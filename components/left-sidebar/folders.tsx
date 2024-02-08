import { usePathname } from 'next/navigation'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { IconFolders, IconTag } from '@/components/ui/icons/next-icons'

import { SELECTED_ITEM } from '@/lib/constants'

const TRIGGER_HEADER_STYLE = 'flex flex-1 justify-between pl-3 gap-2 cursor-pointer'
const NAV_ITEM_STYLE = 'flex flex-col pl-2 py-2 items-stretch'

const NAV_ITEM_CONTENT_STYLE = 'flex flex-1 gap-2'

type SidebarFoldersProps = {
  setOpenSecondSidebar: (value: boolean) => void
  openSecondSidebar: boolean
  setTitle: (value: string) => void
  filters: any
  setSelected: (value: any) => void
  selected: any
  subSelected: any
  setSubSelected: (value: any) => void
}

export function Folders({
  setOpenSecondSidebar,
  openSecondSidebar,
  setTitle,
  setSelected,
  selected,
  subSelected,
  setSubSelected,
}: SidebarFoldersProps) {
  const pathname = usePathname()

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
                <ChevronRightIcon />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
