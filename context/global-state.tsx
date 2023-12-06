import React, { createContext, useReducer, useContext, useEffect } from 'react'
import { db, doc, onSnapshot, WEBSITES_COLLECTION } from '@/lib/firebase' // Assuming firebase.ts is in the same directory
import { useToast } from '@/components/ui/use-toast'
import { globalReducer } from '@/context/global-reducer'

interface Props {
  children: React.ReactNode
}

const initialState: GlobalState = {
  unsyncedCollections: [],
}

export const GlobalStateContext = createContext<
  [GlobalState, React.Dispatch<Action>]
>([initialState, () => {}])

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  const { toast } = useToast()

  useEffect(() => {
    const unsubscribeList: Function[] = []
    // Loop through each unsynced collection and set up a Firestore listener
    state.unsyncedCollections.forEach((collection) => {
      console.log(collection)
    })
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
