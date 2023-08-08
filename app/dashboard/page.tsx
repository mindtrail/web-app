import { useState } from 'react'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { Header } from '@/components/header'
import { Chat } from '@/components/chat'
import { Datastore } from '@/components/datastore'

export interface DashboardProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DashboardProps): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  const userId = session.user.id

  return {
    title: 'Chat',
  }
}

export default async function Dashboard({ params }: DashboardProps) {
  console.log(1111)
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/${params.id}`)
  }

  return (
    <>
      <Header session={session} />
      <Chat id={'123'} />
    </>
  )
}
