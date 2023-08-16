'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { DataStoreExtended } from '@/components/datastore/utils'
import { Button } from '@/components/ui/button'
import Typography from '@/components/typography'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type rowProps = {
  dataStore: DataStoreExtended
}

export function DataStoreRowItem({ dataStore }: rowProps) {
  const { id, name, description, dataSources } = dataStore

  const router = useRouter()

  const handleClick = useCallback(() => {
    router.push(`/datastore/${id}`)
  }, [id, router])

  return (
    <div
      onClick={handleClick}
      className='flex w-full group border border-transparent hover:border-border hover:shadow  justify-between rounded-xl text-card-foreground cursor-pointer'
    >
      <div className='flex flex-col p-4'>
        <Typography variant='h5'>{name}</Typography>
        <div className='flex gap-4'>
          <span>{description}</span>
          {dataSources.map((file, index) => (
            <div key={index} className='flex gap-1 items-center shrink-0'>
              <span className='flex h-2 w-2 rounded-full bg-green-500' />
              <p className='text-sm text-muted-foreground whitespace-nowrap text-ellipsis overflow-hidden max-w-[120px]'>
                {file.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className='invisible group-hover:visible flex p-4 gap-4 items-center overflow-auto'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <DotsHorizontalIcon className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' alignOffset={-5} className='w-[200px]' forceMount>
            <DropdownMenuItem onClick={handleClick}>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
