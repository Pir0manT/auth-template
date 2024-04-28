'use client'
import { Slide, SlideProps, TextFieldProps, ThemeProvider } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ConfirmOptions, ConfirmProvider } from 'material-ui-confirm'
import { forwardRef } from 'react'

import BackDropWithBlur from '@/components/BackDropWithBlur'
import theme from '@/styles/theme'

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
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
      <ThemeProvider theme={theme}>
        <ConfirmProvider defaultOptions={confirmDlgOptions as ConfirmOptions}>
          {children}
        </ConfirmProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}

export default Providers
