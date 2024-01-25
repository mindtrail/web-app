'use client'
import { useMemo } from 'react'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { DataSourceStatus } from '@prisma/client'

import { Typography } from '@/components/typography'
import { StatusIcon } from '@/components/collection/statusIcon'
import { Button } from '@/components/ui/button'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type itemProps = {
  collection: CollectionExtended
}

export function CollectionListItem(props: itemProps) {
  const { collection } = props
  const { id, name, description, dataSources } = collection

  console.log(JSON.stringify(collection.dataSources))

  const handleEdit = () => {}

  const handleDelete = () => {}

  const handleClick = (id: string) => {
    console.log(id)
  }

  return (
    <div
      onClick={() => handleClick(id)}
      className="flex w-full group border border-transparent hover:border-border hover:shadow  justify-between rounded-xl text-card-foreground cursor-pointer"
    >
      <div className="flex flex-col p-4 flex-1 overflow-hidden">
        <Typography variant="h5">{name}</Typography>
        <div className="flex gap-4 max-w-full">
          <span className="w-32 shrink-0 overflow-hidden whitespace-nowrap text-ellipsis">
            {description}
          </span>
          {dataSources?.map(({ status, name }, index) => (
            <div key={index} className="flex gap-1 items-center shrink-0">
              <StatusIcon status={status} />
              <div className="text-sm text-muted-foreground ">
                <Tooltip>
                  <TooltipTrigger>
                    <p className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[125px]">
                      {name}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    className={
                      status !== DataSourceStatus.synched ? 'bg-gray-500' : ''
                    }
                  >
                    <p className="flex flex-col gap-2">
                      {status !== DataSourceStatus.synched && (
                        <span className="flex gap-1 items-center capitalize">
                          {status}
                        </span>
                      )}
                      {name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="invisible group-hover:visible flex p-4 gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            alignOffset={-5}
            className="w-[200px]"
            forceMount
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => handleEdit(id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
            <DropdownMenuItem disabled>Share</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(id, name)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
