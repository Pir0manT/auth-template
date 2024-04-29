import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { User } from '@prisma/client'
import type { Metadata } from 'next'
import React from 'react'

import { auth } from '@/auth'
import Providers from '@/components/providers'
import UserMenu from '@/components/user-menu'

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
        <Providers session={session}>
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
              {/*{session?.user && <UserMenu />}*/}
              {session?.user && <UserMenu user={session.user as User} />}
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
        </Providers>
      </body>
    </html>
  )
}
