export const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  const { type, payload } = action

  // console.log('REDUCER ---- ', type, payload)

  switch (type) {
    case 'ADD_UNSYNCED_DATA_STORE':
      return {
        ...state,
        unsyncedCollections: [...state.unsyncedCollections, payload],
      }
    case 'REMOVE_SYNCED_DATA_STORE':
      return {
        ...state,
        unsyncedCollections: state.unsyncedCollections.filter(
          (ds) => ds.id !== payload.id,
        ),
      }
    case 'SET_NESTED_ITEMS_BY_CATEGORY':
      const { entityType, items } = payload
      return {
        ...state,
        nestedItemsByCategory: {
          ...state.nestedItemsByCategory,
          [entityType]: items,
        },
      }
    case 'SET_ACTIVE_NESTED_SIDEBAR':
      return {
        ...state,
        activeNestedSidebar: payload,
      }
    default:
      return state
  }
}
