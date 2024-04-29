'use server'

import { User } from '@prisma/client'
import { z } from 'zod'

import { auth } from '@/auth'
import { getUserByEmail, getUserById } from '@/data/user'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mailer'
import { generateVerificationToken } from '@/lib/tokens'
import { settingSchema } from '@/schemas'

export const updateSettingsAction = async (
  values: z.infer<typeof settingSchema>
) => {
  const session = await auth()
  const user = session?.user
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

  if (dbUser.password === null) {
    // OAuth user
    values.email = undefined
    values.isTwoFactorEnabled = undefined
  }

  let isEmailChanged = false
  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email)
    if (existingUser) {
      return {
        code: 'error',
        message: 'Этот email уже занят!',
      }
    }
    const verificationToken = await generateVerificationToken(
      values.email,
      dbUser.id
    )
    await sendVerificationEmail(
      dbUser.name || '',
      values.email,
      verificationToken.token
    )
    isEmailChanged = true
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: isEmailChanged ? { ...values, emailVerified: null } : { ...values },
  })

  // Update session
  // Судя по приставке unstable это нестабильная версия
  // на текущий момент лучше использовать комбинацию
  // из SessionProvider и useSession для получения данных текущей сессии
  // с вызовом router.refresh() для обновления данных в серверных компонентах
  // https://authjs.dev/reference/next-auth#unstable_update

  // await unstable_update({ user: updatedUser })

  return {
    code: 'success',
    message: isEmailChanged
      ? 'Письмо с подтверждением email отправлено. Проверьте почту!'
      : 'Профиль обновлен!',
  }
}
