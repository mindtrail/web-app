import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { callLangchainChat } from '@/lib/langchain'
import { callFlowiseChat } from '@/lib/flowise'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = await req.json()
  const { searchQuery } = body

  if (!searchQuery) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  try {
    console.log(searchQuery)

    // return callLangchainChat({ searchQuery, chatId, userId })
    return Response.json({ success: 123 })
  } catch (error) {
    console.error('An error occurred:', error)

    return new Response('Server Error', {
      status: 500,
    })
  }
}
