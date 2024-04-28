import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email не может быть пустым' })
    .email({ message: 'Неверный формат email' }),
  password: z.string().min(1, { message: 'Пароль не может быть пустым' }),
  code: z.optional(z.string()),
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email не может быть пустым' })
    .email({ message: 'Неверный формат email' }),
})

export const newPasswordSchema = z
  .object({
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

export const settingSchema = z.object({
  name: z.string().min(1, { message: 'Имя не может быть пустым' }),
  image: z.optional(z.string().url({ message: 'Неверный формат ссылки' })),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(
    z
      .string()
      .min(1, { message: 'Email не может быть пустым' })
      .email({ message: 'Неверный формат email' })
  ),
})

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Пароль должен быть не менее 6 символов' }),
    newPassword: z
      .string()
      .min(6, { message: 'Пароль должен быть не менее 6 символов' }),
    passwordConfirmation: z
      .string()
      .min(6, { message: 'Пароль должен быть не менее 6 символов' }),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: 'Пароли должны совпадать',
    path: ['passwordConfirmation'],
  })
