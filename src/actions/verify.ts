'use server'

import { VerificationToken } from '@prisma/client'

import { getUserByEmail, getUserById } from '@/data/user'
import { getVerificationTokenByToken } from '@/data/verification-token'
import { db } from '@/lib/db'

export const verifyAction = async (token: string) => {
  const existingToken = (await getVerificationTokenByToken(
    token
  )) as VerificationToken
  if (!existingToken) {
    return {
      code: 'error',
      message: 'Неверная ссылка!',
    }
  }

  const hasExpired = new Date() > new Date(existingToken.expires)
  if (hasExpired) {
    return {
      code: 'error',
      message:
        'Срок действия ссылки истек! Выполните вход заново, чтобы получить новую ссылку.',
    }
  }

  const existingUser =
    (await getUserByEmail(existingToken.email)) ||
    (await getUserById(existingToken.userId))
  if (!existingUser) {
    return {
      code: 'error',
      message: 'Пользователь с таким email не найден!',
    }
  }
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  })

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  })

  return {
    code: 'success',
    message: 'Ваш email успешно подтвержден!',
  }
}
