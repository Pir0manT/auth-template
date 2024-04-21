import * as z from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email не может быть пустым' })
    .email({ message: 'Неверный формат email' }),
  password: z.string().min(1, { message: 'Пароль не может быть пустым' }),
})
