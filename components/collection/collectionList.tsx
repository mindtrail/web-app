'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusIcon } from '@radix-ui/react-icons'

import { Typography } from '@/components/typography'
import { CollectionListItem } from '@/components/collection/collectionItem'
import { deleteCollectionApiCall } from '@/lib/api/collection'

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

interface CollectionListProps extends React.ComponentProps<'div'> {
  collectionList: CollectionExtended[]
}

interface KbToDelete {
  id: string
  name: string
}

export function CollectionList({ collectionList }: CollectionListProps) {
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
      await deleteCollectionApiCall(id)
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
      console.error(err)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/collection/${id}`)
  }

  const openChat = (id: string) => {
    router.push(`/chat/${id}`)
  }

  return (
    <div className='flex bg- flex-col self-center flex-1 w-full max-w-6xl py-4 px-6 md:py-12 md:px-8'>
      <div className='flex justify-between py-4 border-b'>
        <Typography variant='h2'>Knowledge Bases</Typography>

        <Link
          href='/collection/create'
          className={buttonVariants({ variant: 'default' })}
        >
          <PlusIcon className='mr-2' />
          Create
        </Link>
      </div>
      <div className='flex flex-wrap w-full'>
        {collectionList.map((collection, index) => (
          <CollectionListItem
            key={index}
            collection={collection}
            // handleDelete={handleDelete}
            // handleEdit={handleEdit}
            // handleClick={openChat}
          />
        ))}
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Knowledge Base?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all the associated data and file. The action cannot be
              undone and will permanently delete
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
