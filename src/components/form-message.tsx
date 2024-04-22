import { Alert, AlertProps } from '@mui/material'

interface FormMessageProps extends AlertProps {
  message?: string
}
const FormMessage = ({ message, ...props }: FormMessageProps) => {
  if (!message) return <></>
  return (
    <Alert {...props} sx={{ ...props.sx, width: '100%' }}>
      {message}
    </Alert>
  )
}

export default FormMessage
