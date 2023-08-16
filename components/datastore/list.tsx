import Typography from '@/components/typography'
import { DataStoreCard } from '@/components/datastore/cardItem'
import { DataStoreExtended } from '@/components/datastore/utils'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface DataStoreListProps extends React.ComponentProps<'div'> {
  dataStoreList: DataStoreExtended[]
}

export function ListDataStores({ dataStoreList }: DataStoreListProps) {
  return (
    <div className='flex flex-col self-center flex-1 w-full max-w-6xl py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex justify-between'>
        <Typography variant='h2'>Knowledge Bases</Typography>

        <Link href='/datastore' className={buttonVariants({ variant: 'default' })}>
          <PlusIcon className='mr-2' />
          Create
        </Link>
      </div>
      <div className='flex gap-6 flex-wrap w-full'>
        {dataStoreList.map((dataStore) => (
          <DataStoreCard key={dataStore.id} dataStore={dataStore} />
        ))}
      </div>
    </div>
  )
}
