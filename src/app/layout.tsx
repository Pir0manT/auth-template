import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import type { Metadata } from 'next'
import React from 'react'

import theme from '@/styles/theme'

export const metadata: Metadata = {
  title: 'Шаблон приложения с авторизацией',
  description:
    'Приложение с авторизацией через email/password и OAuth провайдеров',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="absolute">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Шаблон приложения с авторизацией
                </Typography>
              </Toolbar>
            </AppBar>
            <Box component="main">
              <Toolbar />
              <Container
                maxWidth="xl"
                sx={{
                  height: 'calc(100vh - 64px)',
                  overflow: 'auto',
                  backgroundColor: '#eeeeee',
                }}
              >
                {children}
              </Container>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
