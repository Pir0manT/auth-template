import { CardHeader, CardHeaderProps } from '@mui/material'
import { styled } from '@mui/system'

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

const CenteredHeader: typeof CardHeader = (props: CardHeaderProps) => {
  return <CenteredCardHeader {...props} />
}

export default CenteredHeader
