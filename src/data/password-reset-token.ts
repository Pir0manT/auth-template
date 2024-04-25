import { db } from '@/lib/db'

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const existingToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    })
    return existingToken
  } catch {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const existingToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    })
    return existingToken
  } catch {
    return null
  }
}
