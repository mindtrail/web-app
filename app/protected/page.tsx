import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import SignOut from '@/components/sign-out'

export default async function Home() {
  const session = await getServerSession(authOptions)
  console.log(session)

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/protected`)
  }

  // Example used on the client
  // const { data: session } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect('/api/auth/signin?callbackUrl=/protected')
  //   },
  // })

  console.log(123, session)
  return (
    <div className='flex h-screen bg-black'>
      <div className='w-screen h-screen flex flex-col space-y-5 justify-center items-center'>
        <h2 className='text-white'>Protected Page</h2>
        <p className='text-white'>Welcome, {session?.user?.email}</p>
        <SignOut />
      </div>
    </div>
  )
}
