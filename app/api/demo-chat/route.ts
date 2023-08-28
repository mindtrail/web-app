import { NextResponse } from 'next/server'
// import { AIMessage, HumanMessage } from 'langchain/schema'
// import { StreamingTextResponse, LangChainStream, Message } from 'ai'

// import { getOpenAIConnection } from '@/lib/openAI'

export async function POST(req: Request, res: NextResponse) {
  const { messages } = await req.json()

  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  // const { stream, handlers } = LangChainStream()
  // const chat = getOpenAIConnection()

  // chat
    // .call(
      // (messages as Message[]).map(({ role, content }) =>
        // role == 'user' ? new HumanMessage(content) : new AIMessage(content),
      // ),
      // {},
      // [handlers],
    // )
    // .catch(console.error)

  // return new StreamingTextResponse(stream)
}
