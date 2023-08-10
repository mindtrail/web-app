import { useState } from 'react'
import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { DataStore } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { Header } from '@/components/header'
import { CreateDataStore } from '@/components/datastore'
import { getDataStoreList, createDataStore, deleteAllDataStoresForUser } from '@/lib/dataStore'
import { getDataSourceList } from '@/lib/dataSource'

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

  let dataStoreIsInitializing = false
  let dataStoreId = ''
  // Initial state where one has only an empty dataStore
  if (datastoreList.length === 1) {
    dataStoreId = datastoreList[0].id
    const dataSourceList = await getDataSourceList(userId, dataStoreId)

    dataStoreIsInitializing = !dataSourceList.length
  }

  return (
    <>
      <Header session={session} />
      {dataStoreIsInitializing && <CreateDataStore dataStoreId={dataStoreId} />}
    </>
  )
}
