'use client'
import { ruRU } from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'
import { Inter as AppFont } from 'next/font/google'

const appFont = AppFont({
  weight: ['400', '500', '600'],
  subsets: ['cyrillic'],
  display: 'swap',
})

const theme = createTheme(
  {
    typography: {
      fontFamily: appFont.style.fontFamily,
    },
  },
  ruRU
)

export default theme
