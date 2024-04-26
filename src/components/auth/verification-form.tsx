'use client'

import { Box, CircularProgress } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { verifyAction } from '@/actions/verify'
import CardWrapper from '@/components/auth/card-wrapper'
import FormMessage from '@/components/form-message'
import { setResult, SeverityResult } from '@/lib/helpers'

const VerificationForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [verifyResult, setVerifyResult] = useState<SeverityResult>({
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
        setResult(result, setVerifyResult)
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
