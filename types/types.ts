import { type Message } from 'ai'
import { Session } from 'next-auth'
import { Tag } from '@prisma/client'

declare global {
  interface Chat extends Record<string, any> {
    id: string
    title: string
    createdAt: Date
    userId: string
    path: string
    messages: Message[]
    sharePath?: string
  }

  type ServerActionResult<Result> = Promise<
    | Result
    | {
        error: string
      }
  >

  interface UserWithId {
    id: string | null
  }

  type ExtendedSession = Session & { user: UserWithId | null }

  type DataSourceTag = { tag: Tag }

  type SidebarItem = {
    id: string
    name: string
    description?: string | null
  }

  type NestedItemsByCategory = {
    [key: string]: SidebarItem[]
  }

  type NestedSidebarItem = {
    entityType: string // @TODO make this more specific
    name: string
    url: string
    icon: any
  }

  type HistoryMetadata = {
    name: string
    subParent: string
    parent: string
    parentLink: string
  }
}
