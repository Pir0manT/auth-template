'use client'

import { Card, CardContent } from '@mui/material'

import BackButton from '@/components/auth/back-button'
import Header from '@/components/auth/header'
import Social from '@/components/auth/social'
import DividerWithText from '@/components/auth/divider-with-text'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocialButtons?: boolean
}
const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocialButtons,
}: CardWrapperProps) => {
  return (
    <Card sx={{ width: '400px' }}>
      <Header label={headerLabel} />
      <CardContent>{children}</CardContent>
      {showSocialButtons && (
        <>
          <DividerWithText text={'или войдите через'} />
          <CardContent>
            <Social />
          </CardContent>
        </>
      )}
      <CardContent>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardContent>
    </Card>
  )
}

export default CardWrapper
