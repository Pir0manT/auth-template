'use client'
// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import LoginIcon from '@mui/icons-material/Login'
import { AlertColor, LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { loginAction } from '@/actions/login'
import CardWrapper from '@/components/auth/card-wrapper'
import PasswordField from '@/components/auth/password-field'
import FormMessage from '@/components/form-message'
import { loginSchema } from '@/schemas'
import { useSearchParams } from 'next/navigation'

type LoginResult = { severity: AlertColor | undefined; message: string }

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // control,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  const [isPending, startTransition] = useTransition()
  const [loginResult, setLoginResult] = useState<LoginResult>({
    severity: undefined,
    message: '',
  })

  const urlError = useSearchParams().get('error') === 'OAuthAccountNotLinked'
  useEffect(() => {
    if (urlError) {
      setLoginResult({
        severity: 'error',
        message: 'Email уже занят другим провайдером!',
      })
    }
  }, [urlError])

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    setLoginResult({ severity: undefined, message: '' })

    startTransition(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 3 * 1000)
      })
      loginAction(data).then((result) => {
        if (!result) {
          setLoginResult({ severity: undefined, message: '' })
        } else if (result.code === 'error') {
          setLoginResult({ severity: 'error', message: result.message })
        } else if (result.code === 'success') {
          setLoginResult({ severity: 'success', message: result.message })
        }
      })
    })
  }

  return (
    <>
      <CardWrapper
        headerLabel="Добро пожаловать!"
        backButtonLabel="Еще не зарегистрированы?"
        backButtonHref="/auth/register"
        showSocialButtons
        disableButtons={isPending}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction={'column'} gap={2} mb={3}>
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
            <FormMessage
              message={loginResult.message}
              severity={loginResult.severity}
              onClose={() => {
                setLoginResult({ severity: undefined, message: '' })
              }}
            />
          </Stack>

          <LoadingButton
            variant="contained"
            size="large"
            loadingPosition="start"
            startIcon={<LoginIcon />}
            loading={isPending}
            type="submit"
            fullWidth
          >
            Войти
          </LoadingButton>
        </form>
      </CardWrapper>
      {/*<DevTool control={control} />*/}
    </>
  )
}

export default LoginForm
