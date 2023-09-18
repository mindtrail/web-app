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
      const docRef = doc(db, WEBSITES_COLLECTION, dataStore.id)
      console.log('DOCREF', docRef, dataStore.id)

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          // toast({
          //   title: 'DataStore',
          //   description: `${dataStore.id} has been updated`,
          // })

          // get the status of the doc: synced or unsynced
          // if synced, remove from unsyncedDataStores list
          const status = doc.data()?.status

          // Remove from unsyncedDataStores list
          dispatch({
            type: 'REMOVE_SYNCED_DATA_STORE',
            payload: { id: doc.id },
          })

          console.log(1234, doc.data())
        } else {
          console.log(5555, doc.data())
        }
      })

      unsubscribeList.push(unsubscribe)
    })

    console.log(unsubscribeList)

    // Cleanup: Unsubscribe all listeners when component is unmounted
    return () => {
      unsubscribeList.forEach((unsubscribe) => unsubscribe())
    }
  }, [state])

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}
