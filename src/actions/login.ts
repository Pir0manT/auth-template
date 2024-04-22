'use server'
import { AuthError } from 'next-auth'
import * as z from 'zod'

import { signIn } from '@/auth'
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

  // return { code: 'success', message: 'Проверочное письмо отправлено!' }
  const { email, password } = validatedFields.data
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
