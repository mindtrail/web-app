import prisma from '@/lib/db/connection'
import { EarlyAccessStatus } from '@prisma/client'

export const createEarlyAccessDbOp = async (email: string) => {
  const response = await prisma.earlyAccess.create({
    data: {
      email,
      status: EarlyAccessStatus.new,
    },
  })
  return response
}
