import {
  IconAllData,
  IconHighlight,
  IconTag,
  IconCollection,
  NotesIcon,
} from '@/components/ui/icons/next-icons'

import { RouteIcon } from 'lucide-react'

import { ENTITY_TYPE } from '@/lib/constants'

export const APP_NAME = 'Mind Trail'

export const TOP_SIDEBAR_ITEMS: SidebarNavItem[] = [
  { name: 'All Items', url: '/all-items', icon: IconAllData },
  { name: 'Highlights', url: '/highlights', icon: IconHighlight },
]

export const OTHER_SIDEBAR_ITEMS: SidebarNavItem[] = [
  { name: 'Notes', url: '/notes', icon: NotesIcon },
  { name: 'Flows', url: '/flows', icon: RouteIcon },
]

export const SIDEBAR_FOLDERS: Record<string, NestedSidebarItem> = {
  collection: {
    entityType: ENTITY_TYPE.COLLECTION,
    name: 'Collections',
    url: '/collection',
    icon: IconCollection,
  },
  tag: {
    entityType: ENTITY_TYPE.TAG,
    name: 'Tags',
    url: '/tag',
    icon: IconTag,
  },
}
