import {
  IconAllData,
  IconHighlight,
  IconMultipleFolders,
  IconTag,
} from '@/components/ui/icons/next-icons'

export const APP_NAME = 'Mind Trail'

export const TOP_SIDEBAR_ITEMS = [
  { name: 'All Items', url: '/all-items', icon: IconAllData },
  { name: 'Highlights', url: '/highlights', icon: IconHighlight },
]

export const SIDEBAR_FOLDERS: Record<string, NestedSidebarProps> = {
  folder: {
    entityType: 'folder',
    name: 'Folders',
    url: '/folder',
    icon: IconMultipleFolders,
  },
  tag: {
    entityType: 'tag',
    name: 'Tags',
    url: '/tag',
    icon: IconTag,
  },
}
