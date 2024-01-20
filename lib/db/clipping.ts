import prisma from '@/lib/db/connection'

async function getAllClippings(userId: string) {
  const clippings = await prisma.clipping.findMany({
    where: {
      authorId: userId,
    },
  });
  return clippings;
}

async function createClipping(userId: string, content: string) {
  const newClipping = await prisma.clipping.create({
    data: {
      authorId: userId,
      content: content,
    },
  });
  return newClipping;
}
