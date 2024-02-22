import {
  IconAllData,
  IconHighlight,
  IconTag,
  IconCollection,
} from '@/components/ui/icons/next-icons'

export const APP_NAME = 'Mind Trail'

export const TOP_SIDEBAR_ITEMS = [
  { name: 'All Items', url: '/all-items', icon: IconAllData },
  { name: 'Highlights', url: '/highlights', icon: IconHighlight },
]

export const ENTITY_TYPE = {
  COLLECTION: 'collection',
  TAG: 'tag',
  HIGHLIGHTS: 'highlights',
  ALL_ITEMS: 'all-items',
}

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
