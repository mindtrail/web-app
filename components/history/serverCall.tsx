import { revalidatePath, revalidateTag } from 'next/cache'

export async function serverCall() {
  'use server'
  // revalidatePath('/history')
  revalidateTag('history')
}
