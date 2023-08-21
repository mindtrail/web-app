import Typography from '@/components/typography'
import { DataStoreListItem } from '@/components/datastore/dataStoreItem'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface DataStoreListProps extends React.ComponentProps<'div'> {
  dataStoreList: DataStoreExtended[]
}

export function DataStoreList({ dataStoreList }: DataStoreListProps) {
  return (
    <div className='flex bg- flex-col self-center flex-1 w-full max-w-6xl py-4 px-6 md:py-12 md:px-8'>
      <div className='flex justify-between py-4 border-b'>
        <Typography variant='h2'>Knowledge Bases</Typography>

        <Link href='/datastore/create' className={buttonVariants({ variant: 'default' })}>
          <PlusIcon className='mr-2' />
          Create
        </Link>
      </div>
      <div className='flex flex-wrap w-full'>
        {dataStoreList.map((dataStore) => (
          <DataStoreListItem key={dataStore.id} dataStore={dataStore} />
        ))}
      </div>
    </div>
  )
}
