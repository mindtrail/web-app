import { IconSpinner } from '@/components/ui/icons/next-icons'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='w-full h-full flex justify-center items-center gap-2'>
      <IconSpinner /> loading...
    </div>
  )
}
