import { type Message } from 'ai'
import { Session } from 'next-auth'

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
}
