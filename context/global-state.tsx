import React, { createContext, useReducer, useContext, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// import { db, doc, onSnapshot, WEBSITES_COLLECTION } from '@/lib/firebase' // Assuming firebase.ts is in the same directory
import { globalReducer } from '@/context/global-reducer'
import { getCollectionsByUserId } from '@/lib/serverActions/collection'
import { getTagsList } from '@/lib/serverActions/tag'
// import { getCollectionsByUserId } from '@/lib/serverActions/collection'
// import { getFiltersByUserId } from '@/lib/serverActions/filter'
// import { useToast } from '@/components/ui/use-toast'
import { SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'
import { ENTITY_TYPE } from '@/lib/constants'

interface Props {
  children: React.ReactNode
}

const initialState: GlobalState = {
  unsyncedCollections: [],
  nestedItemsByCategory: {},
  activeNestedSidebar: undefined,
}

export const GlobalStateContext = createContext<[GlobalState, React.Dispatch<Action>]>([
  initialState,
  () => {},
])

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  const pathname = usePathname()

  useEffect(() => {
    const entityType = pathname.split('/')[1]
    const openedSidebar = SIDEBAR_FOLDERS[entityType]

    dispatch({
      type: 'SET_ACTIVE_NESTED_SIDEBAR',
      payload: openedSidebar,
    })
  }, [pathname])

  useEffect(() => {
    getCollectionsList()
    getTags()
  }, [])

  const getCollectionsList = async () => {
    const folders = await getCollectionsByUserId()
    if (Array.isArray(folders)) {
      dispatch({
        type: 'SET_NESTED_ITEMS_BY_CATEGORY',
        payload: {
          entityType: ENTITY_TYPE.COLLECTION,
          items: folders,
        },
      })
    }
  }

  const getTags = async () => {
    const tags = await getTagsList()
    if (Array.isArray(tags)) {
      dispatch({
        type: 'SET_NESTED_ITEMS_BY_CATEGORY',
        payload: {
          entityType: ENTITY_TYPE.TAG,
          items: tags,
        },
      })
    }
  }

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

export const useGlobalStateActions = () => {
  const [, dispatch] = useContext(GlobalStateContext)

  const setNestedItemsByCategory = (payload: SetNestedItemByCat) => {
    dispatch({ type: 'SET_NESTED_ITEMS_BY_CATEGORY', payload })
  }

  const setActiveNestedSidebar = (payload: NestedSidebarItem) => {
    dispatch({ type: 'SET_ACTIVE_NESTED_SIDEBAR', payload })
  }

  return {
    setNestedItemsByCategory,
    setActiveNestedSidebar,
  }
}
