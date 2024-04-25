'use server'
import * as z from 'zod'

import { getUserByEmail } from '@/data/user'
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
  const existingUser = await getUserByEmail(email)

  if (!existingUser)
    return {
      code: 'error',
      message: 'Пользователь с таким email не зарегистрирован',
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
