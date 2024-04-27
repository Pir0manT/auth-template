import LoginIcon from '@mui/icons-material/Login'
import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'

import { LoginButton } from '@/components/auth/login-button'
import { getCurrentUser } from '@/lib/auth'

export default async function Home() {
  const user = await getCurrentUser()
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
      }}
    >
      <Typography
        variant="h1"
        fontWeight="600"
        mb={3}
        sx={{ fontSize: { xs: '50px', sm: '60px' } }}
      >
        🔐Auth
      </Typography>
      <Typography
        variant="h2"
        fontWeight="400"
        sx={{ fontSize: { xs: '16px', sm: '18px' } }}
      >
        Шаблон приложения с авторизацией
      </Typography>
      {!user && (
        <LoginButton>
          <LoadingButton
            variant="contained"
            size="large"
            sx={{ width: '250px', mt: 2 }}
            loadingPosition="start"
            startIcon={<LoginIcon />}
          >
            Войти
          </LoadingButton>
        </LoginButton>
      )}
    </Box>
  )
}
