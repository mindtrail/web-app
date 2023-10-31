import { useEffect, useState } from 'react'
import { getChats, removeChat, shareChat } from '@/app/actions'
import { SidebarActions } from '@/components/sidebar/sidebar-actions'
import { SidebarItem } from '@/components/sidebar/sidebar-item'

export interface SidebarListProps {
  userId?: string
}

export function SidebarList({ userId }: SidebarListProps) {
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    async function fetchChats() {
      const chats = await getChats(userId)
      setChats(chats)
    }

    fetchChats()
  }, [userId])

  return (
    <div className='flex-1 overflow-auto'>
      {chats?.length ? (
        <div className='space-y-2 px-2'>
          {chats.map(
            (chat, index) =>
              chat && (
                <SidebarItem key={index} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              ),
          )}
        </div>
      ) : (
        <div className='p-8 text-center'>
          <p className='text-sm text-muted-foreground'>No chat history</p>
        </div>
      )}
    </div>
  )
}
