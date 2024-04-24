import { Typography } from '@mui/material'

import CardWrapper from '@/components/auth/card-wrapper'

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel={'Упс! Что-то пошло не так '}
      backButtonLabel={'Назад'}
      backButtonHref={'/auth/login'}
    >
      <Typography variant={'body1'} textAlign={'center'}>
        Возможно, неверный логин или пароль
      </Typography>
    </CardWrapper>
  )
}

export default ErrorCard
