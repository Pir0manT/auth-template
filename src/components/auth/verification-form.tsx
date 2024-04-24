'use client'

import { AlertColor } from '@mui/lab'
import { Box, CircularProgress } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { verifyAction } from '@/actions/verify'
import CardWrapper from '@/components/auth/card-wrapper'
import FormMessage from '@/components/form-message'

type VerifyResult = { severity: AlertColor | undefined; message: string }
const VerificationForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [verifyResult, setVerifyResult] = useState<VerifyResult>({
    severity: undefined,
    message: '',
  })

  const onSubmit = useCallback(() => {
    if (!token) {
      setVerifyResult({ severity: 'error', message: 'Неверная ссылка!' })
      return
    }
    verifyAction(token)
      .then((result) => {
        if (!result) {
          setVerifyResult({ severity: undefined, message: '' })
        } else if (result.code === 'error') {
          setVerifyResult({ severity: 'error', message: result.message })
        } else if (result.code === 'success') {
          setVerifyResult({ severity: 'success', message: result.message })
        }
      })
      .catch(() => {
        setVerifyResult({ severity: 'error', message: 'Что-то пошло не так!' })
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel={'Подтверждение адреса электронной почты'}
      backButtonLabel={'На страницу входа'}
      backButtonHref={'/auth/login'}
    >
      {!verifyResult.severity && (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress />
        </Box>
      )}
      {verifyResult.severity && (
        <FormMessage
          message={verifyResult.message}
          severity={verifyResult.severity}
        />
      )}
    </CardWrapper>
  )
}

export default VerificationForm
