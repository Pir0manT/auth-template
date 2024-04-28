import { Theme, Typography } from '@mui/material'

import CenteredCardHeader from '@/components/centered-header'

interface HeaderProps {
  label: string
}

const Header = ({ label }: HeaderProps) => {
  return (
    <CenteredCardHeader
      component="legend"
      title={
        <Typography fontSize="30px" fontWeight="600" mb={2}>
          🔐Auth
        </Typography>
      }
      subheader={
        <Typography
          variant="body1"
          fontSize="14px"
          sx={{ color: (theme: Theme) => theme.palette.grey[600] }}
          textAlign={'center'}
          dangerouslySetInnerHTML={{ __html: label.replace(/\n/g, '<br />') }}
        />
      }
    />
  )
}

export default Header
