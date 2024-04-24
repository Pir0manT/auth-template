'use client'
import { Box, Typography } from '@mui/material'
import { Button } from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'

import YandexIcon from '@/components/auth/yandex-icon'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import DiscordIcon from '@/components/auth/discord-icon'

interface SocialProps {
  disableSocialButtons?: boolean
}

const Social = ({ disableSocialButtons }: SocialProps) => {
  const onClick = async (
    provider: 'google' | 'yandex' | 'discord' | 'github'
  ) => {
    await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
  }
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
          // color="secondary"
          onClick={() => onClick('google')}
          disabled={disableSocialButtons}
        >
          <FcGoogle fontSize={28} />
          <Typography
            variant="body2"
            ml={1}
            sx={{
              textTransform: 'none',
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Google
          </Typography>
        </Button>
        <Button
          variant="outlined"
          fullWidth
          // color="secondary"
          onClick={() => onClick('yandex')}
          disabled={disableSocialButtons}
        >
          <YandexIcon sx={{ fontSize: '30px' }} />
          <Typography
            variant="body2"
            ml={1}
            sx={{
              textTransform: 'none',
              color: (theme) => theme.palette.text.primary,
            }}
          >
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
          // color="secondary"
          onClick={() => onClick('discord')}
          disabled={disableSocialButtons}
        >
          <DiscordIcon sx={{ fontSize: '26px' }} />
          <Typography
            variant="body2"
            ml={1}
            sx={{
              textTransform: 'none',
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Discord
          </Typography>
        </Button>
        <Button
          variant="outlined"
          fullWidth
          // color="secondary"
          onClick={() => onClick('github')}
          disabled={disableSocialButtons}
        >
          <BsGithub fontSize={26} color={'black'} />
          <Typography
            variant="body2"
            ml={1}
            sx={{
              textTransform: 'none',
              color: (theme) => theme.palette.text.primary,
            }}
          >
            GitHub
          </Typography>
        </Button>
      </Box>
    </>
  )
}

export default Social
