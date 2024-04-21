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
        height: '100%',
      }}
    >
      {children}
    </Box>
  )
}

export default Layout
