import {} from '@prisma/client'

declare global {
  // globalState.ts
  type DataStoreToSync = {
    id: string
  }

  type GlobalState = {
    unsyncedDataStores: DataStoreToSync[]
  }

  type Action =
    | { type: 'ADD_UNSYNCED_DATA_STORE'; payload: DataStoreToSync }
    | { type: 'REMOVE_SYNCED_DATA_STORE'; payload: DataStoreToSync } // payload is the id of the Collection
}
