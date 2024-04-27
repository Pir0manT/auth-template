import {
  AppBar,
  Avatar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { User } from '@prisma/client'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

import { auth } from '@/auth'
import UserMenu from '@/components/user-menu'
import theme from '@/styles/theme'

export const metadata: Metadata = {
  title: 'Шаблон приложения с авторизацией',
  description:
    'Приложение с авторизацией через email/password и OAuth провайдеров',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="ru">
      <body>
        <AppRouterCacheProvider>
          <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppBar position="absolute">
                <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
                  <Typography
                    variant={'h4'}
                    fontWeight={600}
                    sx={{
                      flexGrow: { xs: '1', sm: '0' },
                      textAlign: { xs: 'center', sm: 'left' },
                      mr: { xs: 0, sm: 2 },
                      ml: { xs: session?.user ? 8 : 0, sm: 0 },
                    }}
                  >
                    🔑
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                  >
                    Шаблон приложения с авторизацией
                  </Typography>
                  {session?.user && (
                    // <Box sx={{ flexGrow: 0 }}>
                    //   <Tooltip title="Открыть настройки">
                    //     <IconButton>
                    //       <Avatar
                    //         src={session.user?.image || undefined}
                    //         sx={{ width: '48px', height: '48px' }}
                    //       />
                    //     </IconButton>
                    //   </Tooltip>
                    // </Box>
                    <UserMenu user={session.user as User} />
                  )}
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
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
