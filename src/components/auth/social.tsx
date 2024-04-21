'use client'
import { Box, Typography } from '@mui/material'
import { Button } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'

import MailRuIcon from '@/components/auth/mailru-icon'
import VKIcon from '@/components/auth/vk-icon'
import YandexIcon from '@/components/auth/yandex-icon'

const Social = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          marginX: 2,
          mb: 1,
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          onClick={() => {}}
        >
          <FcGoogle fontSize={28} />
          <Typography variant="body2" ml={1}>
            Google
          </Typography>
        </Button>
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          onClick={() => {}}
        >
          <YandexIcon sx={{ fontSize: '30px' }} />
          <Typography variant="body2" ml={1}>
            Яндекс
          </Typography>
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          marginX: 2,
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          onClick={() => {}}
        >
          <VKIcon sx={{ fontSize: '26px' }} />
          <Typography variant="body2" ml={1}>
            Вконтакте
          </Typography>
        </Button>
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          onClick={() => {}}
        >
          <MailRuIcon sx={{ fontSize: '28px' }} />
          <Typography variant="body2" ml={1}>
            mail.ru
          </Typography>
        </Button>
      </Box>
    </>
  )
}

export default Social
