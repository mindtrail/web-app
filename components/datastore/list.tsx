'use client'

import { DataStore } from '@prisma/client'

interface DataStoreListProps extends React.ComponentProps<'div'> {
  datastoreList: DataStore[]
}

export function ListDataStores({ datastoreList }: DataStoreListProps) {
  return (
    <div className='flex flex-col flex-1 w-full items-center py-4 px-6 md:py-12 md:px-8 gap-8'>
      <div className='flex flex-col  max-w-2xl items-center gap-2'>
        datastoreList
        {datastoreList.map((datastore) => (
          <div key={datastore.id} className='flex flex-col w-full gap-2'>
            <p>{datastore.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
