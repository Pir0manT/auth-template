'use client'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { forwardRef, useState } from 'react'

const PasswordField = forwardRef<HTMLInputElement, TextFieldProps>(
  function PasswordField(props, ref) {
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault()
    }

    return (
      <TextField
        {...props}
        ref={ref}
        InputProps={{
          ...props.InputProps,
          type: showPassword ? 'text' : 'password',
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    )
  }
)
export default PasswordField
