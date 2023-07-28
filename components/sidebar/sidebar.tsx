'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { IconSidebar } from '@/components/ui/icons'

export interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <>
      <div className='hidden md:flex'>
        <div className='inset-y-0 flex h-vh w-[250px] lg:w-[300px] flex-col p-0'>
          <div className='p-4'>
            <p className='text-sm font-semibold'>Chat History</p>
          </div>
          {children}
        </div>
      </div>
      <div className='flex relative sm:absolute md:hidden sm:top-2 left-2 z-10'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='ghost' className='-ml-2 h-9 w-9 p-0'>
              <IconSidebar className='h-6 w-6' />
              <span className='sr-only'>Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent className='inset-y-0 flex h-auto w-[300px] flex-col p-0'>
            <SheetHeader className='p-4'>
              <SheetTitle className='text-sm'>Chat History</SheetTitle>
            </SheetHeader>
            {children}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
