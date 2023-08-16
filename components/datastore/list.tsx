import Typography from '@/components/typography'
import { DataStoreCard } from '@/components/datastore/cardItem'
import { DataStoreExtended } from '@/components/datastore/utils'

interface DataStoreListProps extends React.ComponentProps<'div'> {
  dataStoreList: DataStoreExtended[]
}

export function ListDataStores({ dataStoreList }: DataStoreListProps) {
  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        <Typography variant='h2'>Knowledge Bases</Typography>
        <div className='flex gap-6 flex-wrap w-full'>
          {dataStoreList.map((dataStore) => (
            <DataStoreCard key={dataStore.id} dataStore={dataStore} className='w-full' />
          ))}
        </div>
      </div>
    </div>
  )
}
