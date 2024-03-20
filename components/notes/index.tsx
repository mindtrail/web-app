'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'
import { Separator } from '@/components/ui/separator'

const EditorWrapper = dynamic(() => import('./wrapper'), { ssr: false })

export function NotesComponent() {
  const [state] = useGlobalState()

  const { activeNestedSidebar, nestedItemsByCategory } = state
  const { setActiveNestedSidebar, setNestedItemsByCategory } = useGlobalStateActions()

  return (
    <div id='notes' className='flex-1'>
      <EditorWrapper />
    </div>
  )
}
