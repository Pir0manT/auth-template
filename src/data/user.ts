import { User } from '@prisma/client'

import { db } from '@/lib/db'

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await db.user.findUnique({
      where: {
        email,
      },
    })
  } catch {
    return null
  }
}

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    })
  } catch {
    return null
  }
}
