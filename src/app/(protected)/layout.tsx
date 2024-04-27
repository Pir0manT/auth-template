import { Box } from '@mui/material'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        overflow: 'auto',
      }}
    >
      {children}
    </Box>
  )
}

export default Layout
