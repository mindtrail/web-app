'use client'

import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import DataHistory from '@/components/left-sidebar/data'
import TagBoard from '@/components/left-sidebar/tag-board'

type SidebarNavProps = {
  className?: string
}

const TAB_STYLE =
  'font-normal hover:text-foreground data-[state=active]:shadow-none data-[state=active]:font-medium'

export function LeftSidebar({ className }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'flex flex-col w-[256px] border-r flex-shrink-0',
        className,
      )}
    >
      <div className='h-12 flex justify-center items-center'>
        <Link href='/' className='flex w-40 items-center gap-4 px-4'>
          <Image width={32} height={32} src='/icon-2.png' alt='Mind Trail' />
          Mind Trail
        </Link>
      </div>

      <Separator />
      <Tabs defaultValue='data' className='w-full flex flex-col flex-1'>
        <TabsList className='grid grid-cols-2 bg-transparent px-4'>
          <TabsTrigger value='data' className={TAB_STYLE}>
            Data
          </TabsTrigger>
          <TabsTrigger value='tag-board' className={TAB_STYLE}>
            Tag Board
          </TabsTrigger>
        </TabsList>

        <Separator />

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
