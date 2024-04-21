'use client'
// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import LoginIcon from '@mui/icons-material/Login'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import CardWrapper from '@/components/auth/card-wrapper'
import PasswordField from '@/components/auth/password-field'
import { loginSchema } from '@/schemas'

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // control,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  return (
    <>
      <CardWrapper
        headerLabel="Добро пожаловать!"
        backButtonLabel="Еще не зарегистрированы?"
        backButtonHref="/auth/register"
        showSocialButtons
      >
        <form
          onSubmit={handleSubmit(
            async (data) =>
              await new Promise((resolve) => {
                setTimeout(resolve, 3 * 1000)
              })
          )}
          noValidate
        >
          <Stack direction={'column'} gap={2} mb={3}>
            <TextField
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              label="Email"
              variant="outlined"
              fullWidth
              disabled={isSubmitting}
            />
            <PasswordField
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              label="Пароль"
              variant="outlined"
              disabled={isSubmitting}
            />
          </Stack>
          <LoadingButton
            variant="contained"
            size="large"
            loadingPosition="start"
            startIcon={<LoginIcon />}
            loading={isSubmitting}
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
