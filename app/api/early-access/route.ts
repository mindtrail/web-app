import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const payload = (await req.json()) as SavedClipping

  console.log(payload)

  try {
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return new Response('Error creating collection', {
      status: 500,
    })
  }
}
