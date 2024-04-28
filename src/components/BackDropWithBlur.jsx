import { Backdrop } from '@mui/material'
import { styled } from '@mui/material/styles'

const BackDropWithBlur = styled(Backdrop)(({}) => ({
  // zIndex: theme.zIndex.drawer + 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(3px)',
}))

export default BackDropWithBlur
