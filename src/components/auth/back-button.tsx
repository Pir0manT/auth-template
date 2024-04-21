'use client'

import { Button } from '@mui/material'
import Link from 'next/link'
interface BackButtonProps {
  label: string
  href: string
}
const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button
      fullWidth
      variant="text"
      sx={{
        textTransform: 'none',
        textDecoration: 'none',
        '&:hover': { textDecoration: 'underline' },
      }}
      href={href}
      LinkComponent={Link}
    >
      {label}
    </Button>
  )
}

export default BackButton
