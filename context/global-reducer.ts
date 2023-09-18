export const globalReducer = (
  state: GlobalState,
  action: Action,
): GlobalState => {
  console.log('ACTION', action)

  const { type, payload } = action

  switch (type) {
    case 'ADD_UNSYNCED_DATA_STORE':
      return {
        ...state,
        unsyncedDataStores: [...state.unsyncedDataStores, payload],
      }
    case 'REMOVE_SYNCED_DATA_STORE':
      return {
        ...state,
        unsyncedDataStores: state.unsyncedDataStores.filter(
          (ds) => ds.id !== payload.id,
        ),
      }
    default:
      return state
  }
}
