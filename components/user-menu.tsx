'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { type Session } from 'next-auth'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconExternalLink } from '@/components/ui/icons/next-icons'

export interface UserMenuProps {
  user: Session['user']
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu({ user }: UserMenuProps) {
  const inDevelopment = useMemo(
    () => process.env.NODE_ENV === 'development',
    [],
  )

  return (
    <div className='flex items-center justify-end w-full absolute'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='px-2 mr-2 gap-2'>
            <span className=''>{user?.name}</span>
            {user?.image ? (
              <Image
                loader={({ src }) => src}
                className='w-6 h-6 transition-opacity duration-300 rounded-full
                select-none ring-1 ring-zinc-100/10 hover:opacity-80'
                src={user?.image ? `${user.image}` : ''}
                alt={user.name ?? 'Avatar'}
                width={32}
                height={32}
                unoptimized={inDevelopment ? true : false}
              />
            ) : (
              <div
                className='flex items-center justify-center text-xs font-medium
              uppercase rounded-full select-none h-7 w-7 shrink-0 bg-muted/50
              text-muted-foreground'
              >
                {user?.name ? getUserInitials(user?.name) : null}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} className='w-[200px]'>
          <DropdownMenuItem className='flex-col items-start' disabled>
            <div className='text-xs font-medium'>{user?.name}</div>
            <div className='text-xs text-zinc-500'>{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: '/',
              })
            }
            className='text-xs'
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
