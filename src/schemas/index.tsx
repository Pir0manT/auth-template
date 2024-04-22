import * as z from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email не может быть пустым' })
    .email({ message: 'Неверный формат email' }),
  password: z.string().min(1, { message: 'Пароль не может быть пустым' }),
})
export const registerSchema = z
  .object({
    name: z.string().min(1, { message: 'Имя не может быть пустым' }),
    email: z
      .string()
      .min(1, { message: 'Email не может быть пустым' })
      .email({ message: 'Неверный формат email' }),
    password: z
      .string()
      .min(6, { message: 'Пароль должен быть не менее 6 символов' }),
    passwordConfirmation: z
      .string()
      .min(6, { message: 'Пароль должен быть не менее 6 символов' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Пароли должны совпадать',
    path: ['passwordConfirmation'],
  })
