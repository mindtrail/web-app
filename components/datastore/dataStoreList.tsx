'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusIcon } from '@radix-ui/react-icons'

import { Typography } from '@/components/typography'
import { DataStoreListItem } from '@/components/datastore/dataStoreItem'
import { deleteDataStoreApiCall } from '@/lib/api/dataStore'

import { Button, buttonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DataStoreListProps extends React.ComponentProps<'div'> {
  dataStoreList: CollectionExtended[]
}

interface KbToDelete {
  id: string
  name: string
}

export function DataStoreList({ dataStoreList }: DataStoreListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [kbToDelete, setKbToDelete] = useState<KbToDelete | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = (id: string, name: string) => {
    setKbToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!kbToDelete || !kbToDelete.id) {
      return
    }

    const { id, name } = kbToDelete

    try {
      await deleteDataStoreApiCall(id)
      toast({
        title: 'KB deleted',
        description: `${name} has been deleted`,
      })
      router.refresh()
    } catch (err) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: `Something went wrong while deleting ${name}`,
      })
      console.log(err)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/datastore/${id}`)
  }

  const openChat = (id: string) => {
    router.push(`/chat/${id}`)
  }

  return (
    <div className='flex bg- flex-col self-center flex-1 w-full max-w-6xl py-4 px-6 md:py-12 md:px-8'>
      <div className='flex justify-between py-4 border-b'>
        <Typography variant='h2'>Knowledge Bases</Typography>

        <Link
          href='/datastore/create'
          className={buttonVariants({ variant: 'default' })}
        >
          <PlusIcon className='mr-2' />
          Create
        </Link>
      </div>
      <div className='flex flex-wrap w-full'>
        {dataStoreList.map((dataStore, index) => (
          <DataStoreListItem
            key={index}
            dataStore={dataStore}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleClick={openChat}
          />
        ))}
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Knowledge Base?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all the associated data and file. The action
              cannot be undone and will permanently delete{' '}
              <b>{kbToDelete?.name}</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={() => {
                confirmDelete()
                setDeleteDialogOpen(false)
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
