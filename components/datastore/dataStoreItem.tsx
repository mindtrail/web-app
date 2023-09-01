import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import Typography from '@/components/typography'
import { StatusIcon } from '@/components/datastore/statusIcon'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type itemProps = {
  dataStore: DataStoreExtended
  handleEdit: (id: string) => void
  handleDelete: (id: string, name: string) => void
  handleClick: (id: string) => void
}

export function DataStoreListItem(props: itemProps) {
  const { dataStore, handleEdit, handleDelete, handleClick } = props
  const { id, name, description, dataSrcs } = dataStore

  return (
    <div
      onClick={() => handleClick(id)}
      className='flex w-full group border border-transparent hover:border-border hover:shadow  justify-between rounded-xl text-card-foreground cursor-pointer'
    >
      <div className='flex flex-col p-4'>
        <Typography variant='h5'>{name}</Typography>
        <div className='flex gap-4'>
          <span className='w-32 overflow-hidden whitespace-nowrap text-ellipsis'>
            {description}
          </span>
          {dataSrcs.map((file, index) => (
            <div key={index} className='flex gap-1 items-center shrink-0'>
              <StatusIcon status={file.status} />
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
            <Button
              variant='ghost'
              className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
            >
              <DotsHorizontalIcon className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            alignOffset={-5}
            className='w-[200px]'
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
