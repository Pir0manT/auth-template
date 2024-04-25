'use server'
import bcrypt from 'bcryptjs'
import * as z from 'zod'

import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { newPasswordSchema } from '@/schemas'

export const setNewPasswordAction = async (
  values: z.infer<typeof newPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return {
      code: 'error',
      message: 'Неверная ссылка!',
    }
  }

  const validatedFields = newPasswordSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      code: 'error',
      message: 'Неверный пароль!',
    }
  }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

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
        'Срок действия ссылки истек! Запросите новую ссылку для сброса пароля.',
    }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return {
      code: 'error',
      message: 'Пользователь с таким email не найден!',
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  })

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  })

  return {
    code: 'success',
    message: 'Новый пароль установлен!',
  }
}
