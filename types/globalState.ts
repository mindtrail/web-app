import {} from '@prisma/client'

declare global {
  // globalState.ts
  type CollectionToSync = {
    id: string
  }

  type NestedItems = {
    items: SidebarItem[]
    entityType: string
  }

  type GlobalState = {
    unsyncedCollections: CollectionToSync[]
    nestedItemsByCategory: NestedItemsByCategory
    activeNestedSidebar: NestedSidebarItem | undefined
  }

  type Action =
    | { type: 'ADD_UNSYNCED_DATA_STORE'; payload: CollectionToSync }
    | { type: 'REMOVE_SYNCED_DATA_STORE'; payload: CollectionToSync } // payload is ID of collection
    | { type: 'SET_NESTED_ITEMS_BY_CATEGORY'; payload: SetNestedItemByCat }
    | { type: 'SET_ACTIVE_NESTED_SIDEBAR'; payload: NestedSidebarItem }
}
