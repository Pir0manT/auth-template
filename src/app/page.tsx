import LoginIcon from '@mui/icons-material/Login'
import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'

import { LoginButton } from '@/components/auth/login-button'

export default function Home() {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant="h1" fontSize="60px" fontWeight="600" mb={3}>
        🔐Auth
      </Typography>
      <Typography variant="h2" fontSize="18px" fontWeight="400">
        Шаблон приложения с авторизацией
      </Typography>
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
    </Box>
  )
}
