import { Backdrop } from '@mui/material'
import { styled } from '@mui/material/styles'

const BackDropWithBlur = styled(Backdrop)(({}) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(3px)',
}))

export default BackDropWithBlur
