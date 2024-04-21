'use client'

import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'

interface LoginButtonProps {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
}

export const LoginButton = ({
  children,
  mode = 'redirect',
  asChild,
}: LoginButtonProps) => {
  const router = useRouter()
  const onClick = () => {
    router.push('/auth/login')
  }

  if (mode === 'modal') {
    return (
      // eslint-disable-next-line react/jsx-no-comment-textnodes
      <Box component="span">// TODO: implement modal here</Box>
    )
  }
  return (
    <Box component="span" sx={{ cursor: 'pointer' }} onClick={onClick}>
      {children}
    </Box>
  )
}
