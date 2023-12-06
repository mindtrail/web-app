import {} from '@prisma/client'

declare global {
  // globalState.ts
  type CollectionToSync = {
    id: string
  }

  type GlobalState = {
    unsyncedCollections: CollectionToSync[]
  }

  type Action =
    | { type: 'ADD_UNSYNCED_DATA_STORE'; payload: CollectionToSync }
    | { type: 'REMOVE_SYNCED_DATA_STORE'; payload: CollectionToSync } // payload is the id of the Collection
}
