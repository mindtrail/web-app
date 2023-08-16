import { DataStoreExtended } from '@/components/datastore/utils'
import { cn } from '@/lib/utils'

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
    <Card className={cn('w-[360px]', className)} {...props}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex gap-4 items-center overflow-auto'>
        {dataSources.map((file, index) => (
          <div key={index} className='flex gap-1 items-center shrink-0'>
            <span className='flex h-2 w-2 rounded-full bg-green-500' />
            <p className='text-sm text-muted-foreground whitespace-nowrap text-ellipsis overflow-hidden max-w-[120px]'>
              {file.name}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
