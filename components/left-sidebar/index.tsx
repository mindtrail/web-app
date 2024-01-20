'use client'

import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import DataHistory from '@/components/left-sidebar/folders'
import TagBoard from '@/components/left-sidebar/tag-board'

type SidebarNavProps = {
  className?: string
}

const TAB_STYLE_LINK =
  'font-normal hover:text-foreground data-[state=active]:shadow-none data-[state=active]:font-medium'

const TAB_STYLE =
  'font-normal hover:text-foreground data-[state=active]:shadow-none data-[state=active]:font-medium'

export function LeftSidebar({ className }: SidebarNavProps) {
  return (
    <nav className={cn('flex flex-col w-[256px] border-r flex-shrink-0', className)}>
      <div className='h-14 flex items-center'>
        <Link href='/' className='flex gap-2 w-full px-4 py-2'>
          <Image width={24} height={24} src='/icon-2.png' alt='Mind Trail' />
          Mind Trail
        </Link>
      </div>

      <Tabs defaultValue='data' className='w-full flex flex-col flex-1 gap-2'>
        <TabsList className='grid grid-cols-2 mx-2'>
          <TabsTrigger value='data' className={TAB_STYLE}>
            Folders
          </TabsTrigger>
          <TabsTrigger value='tag-board' className={TAB_STYLE}>
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value='data' className='flex-1'>
          <DataHistory />
        </TabsContent>
        <TabsContent value='tag-board' className='flex-1'>
          <TagBoard />
        </TabsContent>
      </Tabs>
    </nav>
  )
}
