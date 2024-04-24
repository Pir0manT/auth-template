import { VerificationToken } from '@prisma/client'

import { db } from '@/lib/db'

export const getVerificationTokenByEmail = async (
  email: string
): Promise<VerificationToken | null> => {
  try {
    return await db.verificationToken.findFirst({
      where: {
        email,
      },
    })
  } catch {
    return null
  }
}

export const getVerificationTokenByToken = async (
  token: string
): Promise<VerificationToken | null> => {
  try {
    return await db.verificationToken.findUnique({
      where: {
        token,
      },
    })
  } catch {
    return null
  }
}
