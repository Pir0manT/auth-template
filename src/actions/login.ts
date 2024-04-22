'use server'
import * as z from 'zod'

import { loginSchema } from '@/schemas'

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      code: 'error',
      message: 'Неправильный email или пароль',
    }
  }

  return { code: 'success', message: 'Проверочное письмо отправлено!' }
}
