'use server'

import { getCurrentUser } from '@/lib/auth'
import { getUserById } from '@/data/user'
import { User } from '@prisma/client'
import { db } from '@/lib/db'
import { logout } from '@/actions/logout'

export const deleteAction = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser)
    return {
      code: 'error',
      message: 'Пользователь не авторизован!',
    }

  const dbUser = await getUserById((currentUser as User).id)
  if (!dbUser)
    return {
      code: 'error',
      message: 'Пользователь не найден!',
    }

  await db.user.delete({
    where: {
      id: dbUser.id,
    },
  })
  return {
    code: 'success',
    message: 'Пользователь удален!',
  }
}
