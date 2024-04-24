'use server'
import { AuthError } from 'next-auth'
import * as z from 'zod'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { sendVerificationEmail } from '@/lib/mailer'
import { generateVerificationToken } from '@/lib/tokens'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { loginSchema } from '@/schemas'

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      code: 'error',
      message: 'Неправильный email или пароль',
    }
  }

  const { email, password } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  if (existingUser && !existingUser?.emailVerified) {
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(
      existingUser.name as string,
      verificationToken.email,
      verificationToken.token
    )
    return {
      code: 'success',
      message: 'Письмо с подтверждением email отправлено. Проверьте почту!',
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      // redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            code: 'error',
            message: 'Неправильный email или пароль',
          }
        default:
          return {
            code: 'error',
            message: 'Что-то пошло не так',
          }
      }
    }
    throw error
  }
}
