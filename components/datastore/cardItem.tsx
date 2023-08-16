import { DataStoreExtended } from '@/components/datastore/utils'
import { cn } from '@/lib/utils'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const files = [
  {
    title: 'File 1',
    description: '1 hour ago',
  },
  {
    title: 'File 2!',
    description: '1 hour ago',
  },
  {
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago',
  },
]

type CardProps = React.ComponentProps<typeof Card> & {
  dataStore: DataStoreExtended
}

export function DataStoreCard({ dataStore, className, ...props }: CardProps) {
  const { name, description, dataSources } = dataStore

  return (
    <Card
      className={cn(
        'shadow-none border-transparent hover:border-border hover:shadow w-full flex justify-between',
        className,
      )}
      {...props}
    >
      <CardHeader className='p-4'>
        <CardTitle>{name}</CardTitle>
        <CardDescription className='flex gap-4'>
          <span>{description}</span>
          {dataSources.map((file, index) => (
            <div key={index} className='flex gap-1 items-center shrink-0'>
              <span className='flex h-2 w-2 rounded-full bg-green-500' />
              <p className='text-sm text-muted-foreground whitespace-nowrap text-ellipsis overflow-hidden max-w-[120px]'>
                {file.name}
              </p>
            </div>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex p-4 gap-4 items-center overflow-auto'>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </CardContent>
    </Card>
  )
}
