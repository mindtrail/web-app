'use client'

import { Button } from '@/components/ui/button'
import { IconSettings } from '../ui/icons/next-icons'

const TRIGGER_HEADER_STYLE =
  'flex flex-1 justify-between pl-1 gap-2 cursor-pointer'
const NAV_ITEM_STYLE = 'flex flex-col py-2 items-stretch'

const NAV_ITEM_CONTENT_STYLE = 'flex flex-1  gap-4'

export default function LeftSidebarFooter({ user }: { user: any }) {
  return (
    <div className="flex flex-col">
      <div className={NAV_ITEM_STYLE}>
        <div className={TRIGGER_HEADER_STYLE}>
          <Button
            variant="sidebarSection"
            className="whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <div className={NAV_ITEM_CONTENT_STYLE}>
              <IconSettings />
              {user?.email}
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
