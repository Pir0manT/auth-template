'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption'
import { LoadingButton } from '@mui/lab'
import { Stack } from '@mui/material'
import { User } from '@prisma/client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { changePasswordAction } from '@/actions/change-password'
import CardWrapper from '@/components/auth/card-wrapper'
import PasswordField from '@/components/auth/password-field'
import FormMessage from '@/components/form-message'
import { useCurrentUser } from '@/hooks/use-current-user'
import { setResult, SeverityResult } from '@/lib/helpers'
import { changePasswordSchema } from '@/schemas'

const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      passwordConfirmation: '',
    },
    mode: 'onTouched',
  })

  const [isPending, startTransition] = useTransition()
  const [changePasswordResult, setChangePasswordResult] =
    useState<SeverityResult>({
      severity: undefined,
      message: '',
    })

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    setChangePasswordResult({ severity: undefined, message: '' })
    startTransition(async () => {
      changePasswordAction(values)
        .then((result) => {
          setResult(result, setChangePasswordResult)
        })
        .catch(() => {
          setChangePasswordResult({
            severity: 'error',
            message: 'Что-то пошло не так!',
          })
        })
    })
  }

  const currentUser = useCurrentUser()
  if (!currentUser || !(currentUser as User).password) return null

  return (
    <CardWrapper
      headerLabel={'Изменение пароля'}
      backButtonLabel={'На главную'}
      backButtonHref={'/'}
      disableButtons={isPending}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack direction={'column'} gap={2} mb={3}>
          <PasswordField
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            label="Текущий пароль"
            variant="outlined"
            disabled={isPending}
          />
          <PasswordField
            {...register('newPassword')}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            label="Новый пароль"
            variant="outlined"
            disabled={isPending}
          />
          <PasswordField
            {...register('passwordConfirmation')}
            error={!!errors.passwordConfirmation}
            helperText={errors.passwordConfirmation?.message}
            label="Новый пароль еще раз"
            variant="outlined"
            disabled={isPending}
          />
          <FormMessage
            message={changePasswordResult.message}
            severity={changePasswordResult.severity}
            onClose={() =>
              setChangePasswordResult({ severity: undefined, message: '' })
            }
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
          изменить пароль
        </LoadingButton>
      </form>
    </CardWrapper>
  )
}

export default ChangePasswordForm
