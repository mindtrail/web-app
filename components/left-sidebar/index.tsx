'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import DataHistory from '@/components/left-sidebar/data'
import TagBoard from '@/components/left-sidebar/tag-board'

type SidebarNavProps = {
  className?: string
}

export function LeftSidebar({ className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex flex-col basis-[256px] bg-slate-100', className)}>
      <div className='h-12 flex justify-center items-center'>
        <Link href='/' className='flex w-40 items-center gap-4 px-4'>
          <Image width={32} height={32} src='/icon-2.png' alt='Mind Trail' />
          Mind Trail
        </Link>
      </div>

      <Separator />
      <div className='flex items-center '>
        <Tabs defaultValue='data' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='data'>Data</TabsTrigger>
            <TabsTrigger value='tag-board'>Tag Board</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value='data'>
            <DataHistory />
          </TabsContent>
          <TabsContent value='tag-board'>
            <TagBoard />
          </TabsContent>
        </Tabs>
      </div>
    </nav>
  )
}
