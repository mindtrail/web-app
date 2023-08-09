import { useState } from 'react'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { DataStore } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { Header } from '@/components/header'
import { Chat } from '@/components/chat'
import { CreateDataStore } from '@/components/datastore'
import { getDataStoreList, createDataStore, deleteAllDataStoresForUser } from '@/lib/data-store'
import { getDataSourceList } from '@/lib/data-store/dataSource'

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

  // const userId = session.user.id
  return {
    title: 'Chat',
  }
}

export default async function Dashboard({ params }: DashboardProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/${params.id}`)
  }

  // await deleteAllDataStoresForUser(session?.user?.id)

  const userId = session?.user?.id
  let datastoreList = await getDataStoreList(userId)

  if (!datastoreList.length) {
    const dsName = `DataStore - ${new Date().toLocaleString()}`
    const newDs = await createDataStore(userId, dsName)
    datastoreList = [newDs] as [DataStore]
  }

  if (datastoreList.length === 1) {
    const dsId = datastoreList[0].id
    const dataSourceList = await getDataSourceList(userId, dsId)
  }

  // const initializingDS = datastoreList.length === 1 && datastoreList[0]. === 'initializing'

  return (
    <>
      <Header session={session} />
      {!datastoreList.length && <CreateDataStore />}
    </>
  )
}
