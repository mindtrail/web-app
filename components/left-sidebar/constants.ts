import {
  IconAllData,
  IconHighlight,
  IconMultipleFolders,
  IconTag,
} from '@/components/ui/icons/next-icons'

export const TOP_SIDEBAR_ITEMS = [
  { name: 'All Items', url: '/all-items', icon: IconAllData },
  { name: 'Highlights', url: '/highlights', icon: IconHighlight },
]

export const SIDEBAR_FOLDERS = {
  FOLDERS: 'Folders',
  TAGS: 'Tags',
}

export const SIDEBAR_FOLDERS_PROPS: Record<string, SidebarFoldersProps> = {
  folder: {
    name: SIDEBAR_FOLDERS.FOLDERS,
    url: '/folder',
    icon: IconMultipleFolders,
  },
  tag: {
    name: SIDEBAR_FOLDERS.TAGS,
    url: '/tag',
    icon: IconTag,
  },
}
