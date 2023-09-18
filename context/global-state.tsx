import React, { createContext, useReducer, useContext, useEffect } from 'react'
import { db, doc, onSnapshot, WEBSITES_COLLECTION } from '@/lib/firebase' // Assuming firebase.ts is in the same directory
import { useToast } from '@/components/ui/use-toast'
import { globalReducer } from '@/context/global-reducer'

interface Props {
  children: React.ReactNode
}

const initialState: GlobalState = {
  unsyncedDataStores: [],
}

export const GlobalStateContext = createContext<
  [GlobalState, React.Dispatch<Action>]
>([initialState, () => {}])

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  const { toast } = useToast()

  useEffect(() => {
    const unsubscribeList: Function[] = []

    console.log('STATE', state)
    // Loop through each unsynced dataStore and set up a Firestore listener
    state.unsyncedDataStores.forEach((dataStore) => {
      const unsubscribe = onSnapshot(
        doc(db, WEBSITES_COLLECTION, dataStore.id),
        (doc) => {
          console.log(doc)
          // Show toast
          toast({
            title: 'DataStore updated',
            description: `${dataStore.id} has been updated`,
          })

          // Remove from unsyncedDataStores list
          // dispatch({
          // type: 'REMOVE_SYNCED_DATA_STORE',
          // payload: dataStore.id,
          // })
        },
      )

      unsubscribeList.push(unsubscribe)
    })

    // Cleanup: Unsubscribe all listeners when component is unmounted or when all dataStores are synced
    return () => {
      unsubscribeList.forEach((unsubscribe) => unsubscribe())
    }
  }, [state, toast])

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  console.log('context', context)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}
