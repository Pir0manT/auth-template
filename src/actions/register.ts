'use server'
import bcrypt from 'bcryptjs'
import * as z from 'zod'

import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mailer'
import { generateVerificationToken } from '@/lib/tokens'
import { registerSchema } from '@/schemas'

export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  const validatedFields = registerSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      code: 'error',
      message: 'Неправильный email или пароль',
    }
  }

  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return {
      code: 'error',
      message: 'Пользователь с таким email уже существует',
    }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })
  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail(
    name,
    verificationToken.email,
    verificationToken.token
  )

  return {
    code: 'success',
    message: 'Письмо с подтверждением email отправлено. Проверьте почту!',
  }
}
