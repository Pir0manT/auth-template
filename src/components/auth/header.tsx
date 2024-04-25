import { CardHeader, Theme, Typography } from '@mui/material'
import { styled } from '@mui/system'

interface HeaderProps {
  label: string
}

const CenteredCardHeader = styled(CardHeader)(() => ({
  '& .MuiCardHeader-content': {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    mt: 2,
    mb: 1,
  },
})) as typeof CardHeader

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
