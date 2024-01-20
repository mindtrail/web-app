import prisma from '@/lib/db/connection'

export async function getAllClippings(userId: string) {
  const clippings = await prisma.clipping.findMany({
    where: {
      authorId: userId,
    },
  })
  return clippings
}

type CreateClipping = {
  userId: string
  content: string
}

export async function createClipping({ userId, content }: CreateClipping) {
  console.log('createClipping', userId, content)
  // const newClipping = await prisma.clipping.create({
  //   data: {
  //     authorId: userId,
  //     content: content,
  //   },
  // });
  // return newClipping;
}
