'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption'
import { LoadingButton } from '@mui/lab'
import { Stack } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { setNewPasswordAction } from '@/actions/new-password'
import CardWrapper from '@/components/auth/card-wrapper'
import PasswordField from '@/components/auth/password-field'
import FormMessage from '@/components/form-message'
import { setResult, SeverityResult } from '@/lib/helpers'
import { newPasswordSchema } from '@/schemas'

const NewPasswordForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onTouched',
  })

  const [isPending, startTransition] = useTransition()
  const [setNewPasswordResult, setNewPasswordSetResult] =
    useState<SeverityResult>({
      severity: undefined,
      message: '',
    })

  const onSubmit = (data: z.infer<typeof newPasswordSchema>) => {
    setNewPasswordSetResult({ severity: undefined, message: '' })

    startTransition(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 3 * 1000)
      })
      setNewPasswordAction(data, token)
        .then((result) => {
          setResult(result, setNewPasswordSetResult)
        })
        .catch(() => {
          setNewPasswordSetResult({
            severity: 'error',
            message: 'Что-то пошло не так!',
          })
        })
    })
  }
  if (!token) return null
  return (
    <CardWrapper
      headerLabel={'Введите новый пароль'}
      backButtonLabel={'На страницу входа'}
      backButtonHref={'/auth/login'}
      disableButtons={isPending}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack direction={'column'} gap={2} mb={3}>
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
            message={setNewPasswordResult.message}
            severity={setNewPasswordResult.severity}
            onClose={() => {
              setNewPasswordSetResult({ severity: undefined, message: '' })
            }}
          />
        </Stack>
        <LoadingButton
          variant="contained"
          size="large"
          loadingPosition="start"
          startIcon={<EnhancedEncryptionIcon />}
          loading={isPending}
          type="submit"
          fullWidth
        >
          Установить новый пароль
        </LoadingButton>
      </form>
    </CardWrapper>
  )
}

export default NewPasswordForm
