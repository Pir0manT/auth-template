'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { registerAction } from '@/actions/register'
import CardWrapper from '@/components/auth/card-wrapper'
import PasswordField from '@/components/auth/password-field'
import FormMessage from '@/components/form-message'
import { setResult, SeverityResult } from '@/lib/helpers'
import { registerSchema } from '@/schemas'

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onTouched',
  })

  const [isPending, startTransition] = useTransition()
  const [registerResult, setRegisterResult] = useState<SeverityResult>({
    severity: undefined,
    message: '',
  })

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    setRegisterResult({ severity: undefined, message: '' })

    startTransition(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 3 * 1000)
      })
      registerAction(data)
        .then((result) => {
          setResult(result, setRegisterResult)
        })
        .catch(() => {
          setRegisterResult({
            severity: 'error',
            message: 'Что-то пошло не так!',
          })
        })
    })
  }

  return (
    <>
      <CardWrapper
        headerLabel="Регистрация"
        backButtonLabel="Уже зарегистрированы?"
        backButtonHref="/auth/login"
        disableButtons={isPending}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction={'column'} gap={2} mb={3}>
            <TextField
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              label="Имя пользователя"
              variant="outlined"
              fullWidth
              disabled={isPending}
            />
            <TextField
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              label="Email"
              variant="outlined"
              fullWidth
              disabled={isPending}
            />
            <PasswordField
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              label="Пароль"
              variant="outlined"
              disabled={isPending}
            />
            <PasswordField
              {...register('passwordConfirmation')}
              error={!!errors.passwordConfirmation}
              helperText={errors.passwordConfirmation?.message}
              label="Пароль еще раз"
              variant="outlined"
              disabled={isPending}
            />
            <FormMessage
              message={registerResult.message}
              severity={registerResult.severity}
              onClose={() => {
                setRegisterResult({ severity: undefined, message: '' })
              }}
            />
          </Stack>

          <LoadingButton
            variant="contained"
            size="large"
            loadingPosition="start"
            startIcon={<HowToRegIcon />}
            loading={isPending}
            type="submit"
            fullWidth
          >
            Зарегистрироваться
          </LoadingButton>
        </form>
      </CardWrapper>
    </>
  )
}

export default RegisterForm
