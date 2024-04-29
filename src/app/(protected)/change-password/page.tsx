import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import ChangePasswordForm from '@/components/auth/change-password-form'

const ChangePassword = async () => {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <ChangePasswordForm />
    </SessionProvider>
  )
}

export default ChangePassword
