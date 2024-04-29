'use server'
import { AuthError } from 'next-auth'
import * as z from 'zod'

import { signIn } from '@/auth'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { sendTwoFactorEmail, sendVerificationEmail } from '@/lib/mailer'
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens'
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

  const { email, password, code } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return {
      code: 'error',
      message: 'Неправильный email или пароль',
    }
  }

  if (existingUser && !existingUser?.emailVerified) {
    const verificationToken = await generateVerificationToken(
      email,
      existingUser.id
    )
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

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return {
          code: 'error',
          message: 'Неверный код',
        }
      }
      const expires = new Date(twoFactorToken.expires) < new Date()
      if (expires) {
        return {
          code: 'error',
          message: 'Срок действия кода истек',
        }
      }
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      })
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        })
      }
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorEmail(existingUser.email, twoFactorToken.token)
      return {
        tokenFactor: true,
      }
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
