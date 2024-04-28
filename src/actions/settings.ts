'use server'

import { User } from '@prisma/client'
import { z } from 'zod'

import { getUserById } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'
import { settingSchema } from '@/schemas'

export const settingsAction = async (values: z.infer<typeof settingSchema>) => {
  const user = await getCurrentUser()
  if (!user)
    return {
      code: 'error',
      message: 'Пользователь не авторизован!',
    }
  const dbUser = await getUserById((user as User).id)
  if (!dbUser)
    return {
      code: 'error',
      message: 'Пользователь не авторизован!',
    }

  return {
    code: 'success',
    message: 'Профиль обновлен!',
  }
}
