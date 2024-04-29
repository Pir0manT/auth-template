'use client'
import { CssBaseline, Slide, ThemeProvider } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ConfirmOptions, ConfirmProvider } from 'material-ui-confirm'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import React, { forwardRef } from 'react'

import BackDropWithBlur from '@/components/BackDropWithBlur'
import theme from '@/styles/theme'

interface ProvidersProps {
  children: React.ReactNode
  session: Session | null
}

const Providers = ({ children, session }: ProvidersProps) => {
  const Transition = forwardRef<
    HTMLElement,
    TransitionProps & { children: React.ReactElement }
  >(function Transition({ children, ...props }, ref) {
    return (
      <Slide direction="up" ref={ref} {...props}>
        {children}
      </Slide>
    )
  })
  const confirmDlgOptions = {
    title: 'Подтвердите действие',
    confirmationText: 'ДА',
    cancellationText: 'НЕТ',
    dialogProps: {
      TransitionComponent: Transition,
      BackdropComponent: BackDropWithBlur,
    },
    cancellationButtonProps: { variant: 'outlined', color: 'success' },
    confirmationButtonProps: {
      variant: 'outlined',
      color: 'error',
    },
  }

  return (
    <AppRouterCacheProvider>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider defaultOptions={confirmDlgOptions as ConfirmOptions}>
            <CssBaseline />
            {children}
          </ConfirmProvider>
        </ThemeProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  )
}

export default Providers
