'use server'
import * as z from 'zod'

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

  return { code: 'success', message: 'Проверочное письмо отправлено!' }
}
