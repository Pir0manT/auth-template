'use server'
import * as z from 'zod'

import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/mailer'
import { generatePasswordResetToken } from '@/lib/tokens'
import { resetPasswordSchema } from '@/schemas'

export const resetAction = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  const validatedFields = resetPasswordSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      code: 'error',
      message: 'Неправильный email',
    }
  }

  const { email } = validatedFields.data
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  })

  if (!existingUser)
    return {
      code: 'error',
      message: 'Пользователь с таким email не зарегистрирован',
    }

  if (existingUser.accounts.length > 0) {
    return {
      code: 'warning',
      message: `Для входа с этим email используйте кнопку: ${existingUser.accounts[0].provider.toUpperCase()}`,
    }
  }

  const resetPasswordToken = await generatePasswordResetToken(email)

  await sendPasswordResetEmail(
    existingUser.name as string,
    resetPasswordToken.email,
    resetPasswordToken.token
  )

  return {
    code: 'success',
    message: 'Ссылка для сброса пароля отправлена на почту',
  }
}
