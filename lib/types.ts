import { type Message } from 'ai'
import { Session } from 'next-auth'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

interface UserWithId {
  id: string | null
}

export type ExtendedSession = Session & { user: UserWithId | null }
