import { GearIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

const TRIGGER_HEADER_STYLE = 'flex flex-1 justify-between pl-1 gap-2 cursor-pointer'
const NAV_ITEM_STYLE = 'flex flex-col py-2 items-stretch'

export function LeftSidebarFooter({ user }: { user: any }) {
  return (
    <div className='flex flex-col border-t'>
      <div className={NAV_ITEM_STYLE}>
        <div className={TRIGGER_HEADER_STYLE}>
          <Button
            variant='sidebarSection'
            className='whitespace-nowrap overflow-hidden text-ellipsis'
          >
            <div className='flex flex-1 gap-2 justify-center'>
              <GearIcon width={20} height={20} />
              {user?.email}
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
