'use client'
// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import LoginIcon from '@mui/icons-material/Login'
import { AlertColor, LoadingButton } from '@mui/lab'
import { Link as LinkMui, Stack, TextField } from '@mui/material'
import { styled } from '@mui/system'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { loginAction } from '@/actions/login'
import CardWrapper from '@/components/auth/card-wrapper'
import PasswordField from '@/components/auth/password-field'
import FormMessage from '@/components/form-message'
import { loginSchema } from '@/schemas'
import theme from '@/styles/theme'

type LoginResult = { severity: AlertColor | undefined; message: string }

const NextLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})(({ disabled }: { disabled: boolean }) => ({
  textDecoration: 'none',
  pointerEvents: disabled ? 'none' : 'auto',
}))

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
            <NextLink href={'/auth/reset'} disabled={isPending}>
              <LinkMui
                variant={'body2'}
                underline={'hover'}
                component={'span'}
                sx={{
                  color: (theme) =>
                    isPending
                      ? theme.palette.text.disabled
                      : theme.palette.primary.main,
                }}
              >
                Забыли пароль?
              </LinkMui>
            </NextLink>
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
