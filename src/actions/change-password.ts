'use server'

import { User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { getUserById } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { changePasswordSchema } from '@/schemas'

export const changePasswordAction = async (
  values: z.infer<typeof changePasswordSchema>
) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      code: 'error',
      message: 'Пользователь не авторизован!',
    }
  }

  const dbUser = await getUserById((user as User).id)
  if (!dbUser) {
    return {
      code: 'error',
      message: 'Пользователь не найден!',
    }
  }

  if (!dbUser.password) {
    return {
      code: 'error',
      message: 'Пароль не может быть изменён!',
    }
  }

  const validatedFields = changePasswordSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      code: 'error',
      message: 'Ошибка ввода данных!',
    }
  }

  const { password, newPassword } = validatedFields.data
  const passwordMatch = await bcrypt.compare(password, dbUser.password)

  if (!passwordMatch) {
    return {
      code: 'error',
      message: 'Текущий пароль введён неверно!',
    }
  }
  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      password: await bcrypt.hash(newPassword, 10),
    },
  })

  return {
    code: 'success',
    message: 'Пароль изменён!',
  }
}
