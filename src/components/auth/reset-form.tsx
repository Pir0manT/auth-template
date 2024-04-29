'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField } from '@mui/material'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { resetAction } from '@/actions/reset'
import CardWrapper from '@/components/auth/card-wrapper'
import FormMessage from '@/components/form-message'
import { setResult, SeverityResult } from '@/lib/helpers'
import { resetPasswordSchema } from '@/schemas'

const ResetForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  })

  const [isPending, startTransition] = useTransition()
  const [resetResult, setResetResult] = useState<SeverityResult>({
    severity: undefined,
    message: '',
  })

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    setResetResult({ severity: undefined, message: '' })

    startTransition(async () => {
      // await new Promise((resolve) => {
      //   setTimeout(resolve, 3 * 1000)
      // })
      resetAction(data)
        .then((result) => {
          setResult(result, setResetResult)
        })
        .catch(() => {
          setResetResult({ severity: 'error', message: 'Что-то пошло не так!' })
        })
    })
  }

  return (
    <CardWrapper
      headerLabel={
        'Забыли свой пароль? \n Введите email, который вы указали при регистрации.'
      }
      backButtonLabel={'На страницу входа'}
      backButtonHref={'/auth/login'}
      disableButtons={isPending}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack direction="column" gap={2} mb={3}>
          <TextField
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            label="Email"
            variant="outlined"
            fullWidth
            disabled={isPending}
          />
          <FormMessage
            message={resetResult.message}
            severity={resetResult.severity}
            onClose={() => {
              setResetResult({ severity: undefined, message: '' })
            }}
          />
        </Stack>
        <LoadingButton
          variant="contained"
          loadingPosition="start"
          loading={isPending}
          startIcon={<SendIcon />}
          type="submit"
          fullWidth
        >
          Отправить письмо для сброса
        </LoadingButton>
      </form>
    </CardWrapper>
  )
}

export default ResetForm
