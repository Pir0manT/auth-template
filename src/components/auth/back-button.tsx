'use client'

import { Button, ButtonProps } from '@mui/material'
import Link from 'next/link'
interface BackButtonProps extends ButtonProps {
  label: string
}
const BackButton = ({ label, ...props }: BackButtonProps) => {
  return (
    <Button
      {...props}
      fullWidth
      variant="text"
      sx={{
        textTransform: 'none',
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' },
      }}
      LinkComponent={Link}
    >
      {label}
    </Button>
  )
}

export default BackButton
